'use server'
import { auth } from '@/lib/auth/server'
import { db } from '@/lib/db';
import { deleteFile } from '@/lib/media';
import { showsTable, mediaTable, artistsTable, showsArtistsTable } from '@/lib/db/schema'
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { eq, sql } from 'drizzle-orm';

/*
    NEED TO BE ABLE TO
    Post show:
        Takes in form data and updates a show in neon
    Delete show:
        Takes in show id and deletes it, deletes poster

    Delete media by object key and id
        Delete
    Add artist to db
*/


const getString = (name: string, formData: FormData) : string => {
    const value = formData.get(name)

    if (typeof value !== "string") {
        throw new Error(`Invalid type ${value}`)
    }

    return value
}
const getNum = (name: string, formData: FormData): number | undefined => {
    const value = formData.get(name)

    // true for null or undefined
    if (value == undefined) return undefined
    
    return Number(value)
}
const showFromFormData = (formData: FormData): typeof showsTable.$inferInsert => {
    const title = getString("title", formData)
    return {
        id: getNum("id", formData),
        slug: convertToSlug(title),
        title: title,
        description: getString("description", formData),
        venue: getString("venue", formData),
        date: getString("date", formData),
        ticketUrl: getString("ticketUrl", formData),
    }
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
const requireUser = async () => {
    const { data: session } = await auth.getSession();
    
    if (!session?.user) {
        throw new Error("Unauthorized")
    }
    return session.user
}


/**
 * FORM METHOD
 * 
 * Given valid FormData from the add/edit show form, modify the shows database 
 */
export async function postShow(formData: FormData) {
    const user = await requireUser()

    const show = showFromFormData(formData)

    if (show.id) {
        // if already existing show, update data
        const [existingShow] = await db.update(showsTable)
            .set(show)
            .where(eq(showsTable.id, show.id))
            .returning()
        show.posterMediaID = existingShow.posterMediaID // save existing show poster
    }
    else {
        // if no show, create show in db
        const [newShow] = await db.insert(showsTable)
            .values(show)
            .returning();
        show.id = newShow.id
    }

    // check if user uploaded file for poster
    const form_posterUuid = formData.get("poster-uuid") as string | null
    if (form_posterUuid) {
        await addPosterUuid(form_posterUuid, show.id)
        if (show.posterMediaID) {
            // show already has picture, delete in cloudflare and db
            await deleteMediaByID(show.posterMediaID)
        }
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
 * FORM METHOD
 * 
 *  Given a valid showID in FormData, remove the show from the database, 
 *  as well as its media in Cloudflare and Neon DB 
 *
 */
export async function deleteShow(formData: FormData) {
    const user = await requireUser()

    const showID = getNum("id", formData)
    if (showID) {
        // get show data from db
        const [show] = await db.select()
        .from(showsTable)
        .where(eq(showsTable.id, showID))
        
        // find id of poster if exists, and delete from bucket
        if (show.posterMediaID) {
            await deleteMediaByID(show.posterMediaID)
        }

        // delete shows images
        await deleteMediaByShowID(showID)

        // delete show
        await db.delete(showsTable)
            .where(eq(showsTable.id, showID))
    

    }
    
    // let user see changes
    revalidatePath("/");
}


type AddArtistToDBProps = {
    name: string,
    profileMediaID?: number,
    instagramHandle?: string,
    instagramUrl?: string,
    description?: string,
    featured?: boolean
}

/** 
 * FORM METHOD
 * 
 * Creates an artist in the database; Returns newly created artist data
 * 
*/
export async function postArtist(formdata: FormData) {
    await requireUser()

    const idValue = formdata.get("id")
    const id = idValue === null ? undefined : Number(idValue)
    if (idValue !== null && (typeof idValue !== "string" || !Number.isSafeInteger(id) || !id || id < 1)) {
        throw new Error("Invalid artist ID")
    }

    const name = getString("name", formdata).trim()
    const slug = convertToSlug(name)
    if (!name || name.length > 255 || !slug) throw new Error("Enter a valid artist name")

    const instagramHandle = getString("instagramHandle", formdata).trim()
    const instagramUrl = getString("instagramUrl", formdata).trim()
    if (instagramUrl) {
        const url = new URL(instagramUrl)
        if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("Invalid Instagram link")
    }

    const values = {
        name,
        instagramHandle: instagramHandle || null,
        instagramUrl: instagramUrl || null,
        description: getString("description", formdata).trim() || null,
        featured: formdata.get("featured") === "true",
    }
    const objectKey = formdata.get("profile-uuid")
    if (objectKey !== null && (typeof objectKey !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(objectKey))) {
        throw new Error("Invalid profile photo")
    }

    const [existingArtist] = id
        ? await db.select().from(artistsTable).where(eq(artistsTable.id, id))
        : []
    if (id && !existingArtist) throw new Error("Artist not found")

    let newMediaID: number | undefined
    let savedArtist: typeof artistsTable.$inferSelect
    try {
        if (objectKey) {
            const [media] = await db.insert(mediaTable)
                .values({ objectKey, mediaType: "artist_profile" })
                .returning()
            newMediaID = media.id
        }

        const profile = newMediaID ? { profileMediaID: newMediaID } : {}
        const [saved] = id
            ? await db.update(artistsTable).set({ ...values, ...profile }).where(eq(artistsTable.id, id)).returning()
            : await db.insert(artistsTable).values({ ...values, ...profile, slug }).returning()
        if (!saved) throw new Error("Artist not found")
        savedArtist = saved
    } catch (error) {
        if (newMediaID) await db.delete(mediaTable).where(eq(mediaTable.id, newMediaID))
        if (objectKey) await deleteFile(objectKey)
        throw error
    }

    if (newMediaID && existingArtist?.profileMediaID) {
        await deleteUnusedArtistPhoto(existingArtist.profileMediaID)
    }

    revalidatePath("/artists")
    revalidatePath(`/artists/${savedArtist.slug}`)
    revalidatePath("/")
    revalidatePath("/show/[slug]", "page")
    return savedArtist
}

export async function deleteArtist(formData: FormData) {
    await requireUser()

    const value = formData.get("id")
    const id = typeof value === "string" && value.trim() ? Number(value) : NaN
    if (!Number.isSafeInteger(id) || id < 1) throw new Error("Invalid artist ID")

    const [, deletedArtists] = await db.batch([
        db.delete(showsArtistsTable).where(eq(showsArtistsTable.artistID, id)),
        db.delete(artistsTable).where(eq(artistsTable.id, id)).returning({
            slug: artistsTable.slug,
            profileMediaID: artistsTable.profileMediaID,
        }),
    ])
    const [artist] = deletedArtists
    if (!artist) throw new Error("Artist not found")

    if (artist.profileMediaID) await deleteUnusedArtistPhoto(artist.profileMediaID)

    revalidatePath("/artists")
    revalidatePath(`/artists/${artist.slug}`)
    revalidatePath("/")
    revalidatePath("/show/[slug]", "page")
    redirect("/artists")
}

async function deleteUnusedArtistPhoto(mediaID: number) {
    try {
        const [media] = await db.select().from(mediaTable).where(eq(mediaTable.id, mediaID))
        const [artist] = await db.select({ id: artistsTable.id }).from(artistsTable)
            .where(eq(artistsTable.profileMediaID, mediaID)).limit(1)
        const [show] = await db.select({ id: showsTable.id }).from(showsTable)
            .where(eq(showsTable.posterMediaID, mediaID)).limit(1)
        if (media?.mediaType === "artist_profile" && !artist && !show) {
            await deleteFile(media.objectKey)
            await db.delete(mediaTable).where(eq(mediaTable.id, mediaID))
        }
    } catch (error) {
        console.error("Could not remove the artist photo", error)
    }
}
/** 
 * Not form data, but needs auth
 * 
 * Creates an artist in the database; Returns newly created artist data. 
*/
export async function addArtistToDB({name, profileMediaID, instagramHandle, instagramUrl, description, featured = false}: AddArtistToDBProps) {
    const user = await requireUser()

    const [newArtist] = await db.insert(artistsTable)
        .values({
            name: name,
            slug: convertToSlug(name),
            profileMediaID: profileMediaID,
            instagramHandle: instagramHandle,
            instagramUrl: instagramUrl,
            description: description,
            featured: featured,
        })
        .returning()

    revalidatePath("/artists")
    revalidatePath("/")
    revalidatePath("/archive")
    revalidatePath("/show/[slug]", "page")

    return newArtist
}


/**
 * FORM METHOD 
 * 
 * Adds each media UUID in FormData to the media table for a certain show
 */
export async function addPicsToGallery(formData: FormData) {
    const user = await requireUser()
    
    // parse formdata
    const showID = Number(formData.get("id") as string)
    const picUuids = formData.getAll('uuids') as string[];
    await addUuidsToMedia(picUuids, showID, "gallery_image")
    
    revalidatePath("/");
}

/** Move a gallery photo to the last existing gallery ID for its show. */
export async function moveGalleryImageToBack(showID: number, objectKey: string) {
    await requireUser()

    if (!Number.isSafeInteger(showID) || showID < 1 || showID > 2147483647 ||
        typeof objectKey !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(objectKey)) {
        throw new Error("Invalid gallery image")
    }

    // IDs are global and may have gaps or belong to posters and other shows.
    // Rotate the photo data through this show's existing gallery ID slots in
    // one update, avoiding primary-key collisions and preserving references.
    // Lock the gallery first so concurrent moves cannot overwrite each other.
    await db.batch([
        db.execute(sql`
            SELECT id FROM media
            WHERE show_id = ${showID} AND media_type = 'gallery_image'
            ORDER BY id FOR UPDATE
        `),
        db.execute(sql`
        WITH selected AS (
            SELECT id FROM media
            WHERE show_id = ${showID} AND object_key = ${objectKey}::uuid
                AND media_type = 'gallery_image'
        ), ordered AS (
            SELECT id,
                lead(object_key) OVER (ORDER BY id) AS next_key,
                lead(upload_timestamp) OVER (ORDER BY id) AS next_timestamp,
                first_value(object_key) OVER (ORDER BY id) AS first_key,
                first_value(upload_timestamp) OVER (ORDER BY id) AS first_timestamp
            FROM media
            WHERE show_id = ${showID} AND media_type = 'gallery_image'
                AND id >= (SELECT id FROM selected)
        )
        UPDATE media
        SET object_key = coalesce(ordered.next_key, ordered.first_key),
            upload_timestamp = coalesce(ordered.next_timestamp, ordered.first_timestamp)
        FROM ordered
        WHERE media.id = ordered.id
        `),
    ])

    revalidatePath("/show/[slug]", "page")
    revalidatePath("/archive")
}

async function addUuidsToMedia(uuids: string[], showID: number, type: typeof mediaTable.$inferInsert["mediaType"]) {
    await db.insert(mediaTable)
        .values(
            uuids.map((uuid) => ({
                objectKey: uuid, showID: showID, mediaType: type 
            }))
        )
}

async function addPosterUuid(uuid: string, showID: number) {
    // add to file to db
    const [newMedia] = await db.insert(mediaTable)
        .values({ objectKey: uuid, showID: showID, mediaType: "poster" })
        .returning();

    // connect show posterMediaId to id from media table
    await db.update(showsTable)
        .set({ posterMediaID: newMedia.id })
        .where(eq(showsTable.id, showID))

}

/**
 * Delete media from neon and cloudflare based on it's Neon database ID
 */

async function deleteMediaByID(id: number) {
    const [poster] = await db.select()
        .from(mediaTable)
        .where(eq(mediaTable.id, id))
    await deleteMediaByObjectKey(poster.objectKey)
}

async function deleteMediaByShowID(showID: number) {
    const media = await db.select()
        .from(mediaTable)
        .where(eq(mediaTable.showID, showID))
    for (const {objectKey} of media) {
        await deleteMediaByObjectKey(objectKey)
    }
}
/**
 * Delete media from neon and cloudflare based on it's object key
 */
export async function deleteMediaByObjectKey(objectKey: string) {
    const user = await requireUser()

    await deleteFile(objectKey)

    await db.delete(mediaTable)
        .where(eq(mediaTable.objectKey, objectKey))

    revalidatePath("/")
}

