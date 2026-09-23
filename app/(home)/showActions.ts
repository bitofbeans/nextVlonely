'use server'
import { auth } from '@/lib/auth/server'
import { db } from '@/lib/db';
import { uploadFile, deleteFile } from '@/lib/media';
import { showsTable, mediaTable } from '../../lib/db/schema';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';

const convertToSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/[^\w\-]+/g, '') // remove all non-word characters
    .replace(/\-\-+/g, '-') // replace multiple hyphens with single hyphen
}

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

export async function postShow(formData: FormData) {
    // Check if authenticated
    const { data: session } = await auth.getSession();
    
    if (!session?.user) {
        throw new Error("Unauthorized")
    }

    // Construct show object
    const show: typeof showsTable.$inferInsert = {
        id: getID(formData),
        title: getString("title", formData),
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
        show.posterMediaID = result.posterMediaID // save for later
    }
    else {
        // if no show, create show in db
        const [newShow] = await db.insert(showsTable)
            .values(show)
            .returning();
        show.id = newShow.id
    }

    // check if user uploaded file for poster
    const posterFile = formData.get("poster") as File | null
    if (posterFile instanceof File && posterFile.size > 0) {
        if(show.posterMediaID) {
            // show already has picture, delete cloudflare
            deleteMediaByID(show.posterMediaID)

            // and from database
            await db.delete(mediaTable)
                .where(eq(mediaTable.id, show.posterMediaID))
        }
        // add to file to db and upload, connect db
        const [newMedia] = await db.insert(mediaTable)
            .values({ showID: show.id })
            .returning();

        await uploadFile(posterFile, newMedia.objectKey)

        await db.update(showsTable)
            .set({ posterMediaID: newMedia.id })
            .where(eq(showsTable.id, show.id))
        }    

    // let user see changes
    revalidatePath("/");
}

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
            deleteMediaByID(show.posterMediaID)
        }
        await db.delete(showsTable)
            .where(eq(showsTable.id, showID))
    }
    
    // let user see changes
    revalidatePath("/");
}

async function deleteMediaByID(id: number) {
    const [poster] = await db.select()
        .from(mediaTable)
        .where(eq(mediaTable.id, id))
    deleteFile(poster.objectKey)
}