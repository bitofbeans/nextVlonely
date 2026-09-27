import { db } from "@/lib/db"
import { artistsTable, mediaTable, showsArtistsTable, showsTable } from "@/lib/db/schema"
import { eq, desc, asc, lt, gt } from "drizzle-orm"

type ShowWithArtists = {
    show: (typeof showsTable.$inferSelect)
    poster: (typeof mediaTable.$inferSelect) | null,
    artists: NonNullable<(typeof artistsTable.$inferSelect)>[],
}
/**
 * Returns an array of objects, with each object containing database data for:
 * * The show
 * * The show's poster
 * * The artists belonging to that show
 * 
 */

export async function queryShows(type: "old" | "new" | "all") {

    const dateNow = new Date().toISOString()

    const filter =
        type == "old" ? lt(showsTable.date, dateNow) :
        type == "new" ? gt(showsTable.date, dateNow) :
        undefined

    // rows has multiple objects for one show and multiple artists
    const rows = await db
        .select({ show: showsTable, poster: mediaTable, artist: artistsTable})
        .from(showsTable)
        .where(filter)
        .leftJoin(mediaTable, eq(showsTable.posterMediaID, mediaTable.id))
        .leftJoin(showsArtistsTable, eq(showsTable.id, showsArtistsTable.showID))
        .leftJoin(artistsTable, eq(showsArtistsTable.artistID, artistsTable.id))
        .orderBy(desc(showsTable.date), asc(showsArtistsTable.position))

 

    // Flatten artists to array 
    const showsMap = new Map<number, ShowWithArtists>()
    for (const {show, poster, artist} of rows) {
        let entry = showsMap.get(show.id)

        if (!entry) {
            entry = { show, poster, artists: []}
            showsMap.set(show.id, entry)
        }

        if (artist) entry.artists.push(artist)
    }
    return Array.from(showsMap.values())
}

/**
 * Returns a list of all artists with their data
 * 
 * Used for options in multiselect
 */
export async function queryArtistOptions() {
    return await db
        .select()
        .from(artistsTable)
}

/**
 * Returns artist data based on their unique slug
 */
export async function queryArtistBySlug(slug: string) {
    const [artist] = await db
        .select()
        .from(artistsTable)
        .where(eq(artistsTable.slug, slug))
    
    return artist
}