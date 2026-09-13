'use server'
import { auth } from '@/lib/auth/server'
import { db } from '@/lib/db';
import { showsTable } from '../../lib/db/schema';
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

export async function postShow(formData: FormData) {
    const { data: session } = await auth.getSession();
    
    if (!session?.user) {
        throw new Error("Unauthorized")
    }



    const showID = getID(formData)

    const show: typeof showsTable.$inferInsert = {
        id: showID,
        title: getString("title", formData),
        description: getString("description", formData),
        venue: getString("venue", formData),
        date: getString("date", formData),
        ticketUrl: getString("ticketUrl", formData),
    };

    if (showID) {
        // if already existing show,
        await db.update(showsTable)
            .set(show)
            .where(eq(showsTable.id, showID))
    }
    else {
        const newShow = await db.insert(showsTable)
            .values(show)
            .returning();
    }
    

    revalidatePath("/");
}

export async function deleteShow(formData: FormData) {
    const { data: session } = await auth.getSession();
    
    if (!session?.user) {
        throw new Error("Unauthorized")
    }

    const showID = getID(formData)
    if (showID) {
        await db.delete(showsTable)
            .where(eq(showsTable.id, showID))
    }
    
    revalidatePath("/");
}