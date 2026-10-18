'use server'
import { auth } from '@/lib/auth/server'
import { db } from '@/lib/db';
import { deleteFile, getUploadMediaUrl } from '@/lib/media';
import { showsTable, mediaTable, artistsTable, showsArtistsTable } from '@/lib/db/schema'
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';

const getString = (name: string, formData: FormData) : string => {
    const value = formData.get(name)

    if (typeof value !== "string") {
        throw new Error(`Invalid type ${value}`)
    }

    return value
}
const getID = (formData: FormData): number | undefined => {
    const value = formData.get("id")

    // true for null or undefined
    if (value == undefined) return undefined
    
    return Number(value)
}
const convertToSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/[^\w\-]+/g, '') // remove all non-word characters
    .replace(/\-\-+/g, '-') // replace multiple hyphens with single hyphen
}

/**
 * Given valid FormData from the add/edit show form, modify the shows database 
 */
export async function postShow(formData: FormData) {
    // Check if authenticated
    const { data: session } = await auth.getSession();
    
    if (!session?.user) {
        throw new Error("Unauthorized")
    }

    // Construct show object
    const title = getString("title", formData)
    const show: typeof showsTable.$inferInsert = {
        id: getID(formData),
        slug: convertToSlug(title),
        title: title,
        description: getString("description", formData),
        venue: getString("venue", formData),
        date: getString("date", formData),
        ticketUrl: getString("ticketUrl", formData),
    };

    if (show.id) {
        // if already existing show, update data
        const [result] = await db.update(showsTable)
            .set(show)
            .where(eq(showsTable.id, show.id))
            .returning()
        show.posterMediaID = result.posterMediaID // save existing show poster
    }
    else {
        // if no show, create show in db
        const [newShow] = await db.insert(showsTable)
            .values(show)
            .returning();
        show.id = newShow.id
    }

    // check if user uploaded file for poster
    const posterUuid = formData.get("poster-uuid") as string | null
    if (posterUuid) {
        if(show.posterMediaID) {
            // show already has picture, delete in cloudflare and db
            await deleteMediaByID(show.posterMediaID)
        }
        await addMediaToDB(posterUuid, show.id, "poster", true)
    }
    
    // remove old artists and add new ones
    const newShowArtistsString = (formData.get("artists")) as string | null
    if (newShowArtistsString) {
        // user submitted artists
        // prepare showArtistsTable detail rows for insertion
        const newShowArtistsRows = newShowArtistsString.split(",").map((id, index) => (
            {
                showID: show.id as number,
                artistID: Number(id),
                position: index + 1
            }
        ))
        // do both at once
        const batchResponse = await db.batch([
            db.delete(showsArtistsTable).where(eq(showsArtistsTable.showID, show.id)),
            db.insert(showsArtistsTable).values(newShowArtistsRows)
        ])
    } else {
        // user submitted no artists, simply delete from db
        await db.delete(showsArtistsTable).where(eq(showsArtistsTable.showID, show.id))
    }

    // let user see changes
    revalidatePath("/");
}

/**
 *  Given a valid showID in FormData, remove the show from the database, 
 *  as well as its media in Cloudflare and Neon DB 
 *
 */
export async function deleteShow(formData: FormData) {
    const { data: session } = await auth.getSession();
    
    if (!session?.user) {
        throw new Error("Unauthorized")
    }

    const showID = getID(formData)
    if (showID) {
        // get show data from db
        const [show] = await db.select()
            .from(showsTable)
            .where(eq(showsTable.id, showID))
        
        // find id of poster if exists, and delete from bucket
        if (show.posterMediaID) {
            await deleteMediaByID(show.posterMediaID)
        }
        await db.delete(showsTable)
            .where(eq(showsTable.id, showID))
    }
    
    // let user see changes
    revalidatePath("/");
}

/**
 * Delete media from neon and cloudflare based on it's Neon database ID
 * 
 */
export async function deleteMediaByID(id: number) {
    const { data: session } = await auth.getSession();
    
    if (!session?.user) {
        throw new Error("Unauthorized")
    }
    const [poster] = await db.select()
        .from(mediaTable)
        .where(eq(mediaTable.id, id))
    await deleteMediaByObjectKey(poster.objectKey)
}

/**
 * Delete media from neon and cloudflare based on it's object key
 * 
 */
export async function deleteMediaByObjectKey(objectKey: string) {
    const { data: session } = await auth.getSession();
    
    if (!session?.user) {
        throw new Error("Unauthorized")
    }

    await deleteFile(objectKey)

    await db.delete(mediaTable)
        .where(eq(mediaTable.objectKey, objectKey))

    revalidatePath("/")
}


type AddArtistToDBProps = {
    name: string,
    profileMediaID?: number,
    instagramHandle?: string,
    instagramUrl?: string,
    description?: string,
}

/** 
 * Creates an artist in the database
 * 
 * Returns newly created artist data
*/
export async function addArtistToDB({name, profileMediaID, instagramHandle, instagramUrl, description}: AddArtistToDBProps) {
    const { data: session } = await auth.getSession();
    
    if (!session?.user) {
        throw new Error("Unauthorized")
    }
    const [newArtist] = await db.insert(artistsTable)
        .values({
            name: name,
            slug: convertToSlug(name),
            profileMediaID: profileMediaID,
            instagramHandle: instagramHandle,
            instagramUrl: instagramUrl,
            description: description,
        })
        .returning()

    return newArtist
}


/**
 * Add media to database
 */
export async function addMediaToDB(uuid: string, showID: number, type: typeof mediaTable.$inferInsert["mediaType"], poster: boolean = false) {
    const { data: session } = await auth.getSession();
    if (!session?.user) { throw new Error("Unauthorized") }
    // add to file to db
    const [newMedia] = await db.insert(mediaTable)
        .values({ objectKey: uuid, showID: showID, mediaType: type })
        .returning();
    console.log(newMedia.id)
    if (poster) {
        // connect show posterMediaId to id from media table
        await db.update(showsTable)
            .set({ posterMediaID: newMedia.id })
            .where(eq(showsTable.id, showID))
    }

}

/**
 * Adds many files to gallery for a certain show
 */
export async function addPicsToGallery(formData: FormData) {
    const { data: session } = await auth.getSession()

    if (!session?.user) {
        throw new Error("Unauthorized")
    }
    const idString = formData.get("id") as string
    const id = Number(idString)

    const picUuids = formData.getAll('uuids') as string[];

    for (const uuid of picUuids) {
        console.log(uuid)
        await addMediaToDB(uuid, id, "gallery_image")
    }
    
    revalidatePath("/");
}