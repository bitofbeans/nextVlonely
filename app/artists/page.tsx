import { db } from "@/lib/db"
import Hero from "../components/Hero"
import InfiniteHeader from "../components/InfiniteHeader"
import ArtistCard from "./ArtistCard"
import { artistsTable, mediaTable } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { getMediaUrl } from "@/lib/media"
import FeaturedArtists from "./FeaturedArtists"
import { colors } from "@/lib/helpers"
import ArtistEdit from "../components/edit/ArtistEdit"

export default async function Artists() {
    const artists = await db.select()
        .from(artistsTable)
    const featuredRows = await db.select({ artist: artistsTable, photo: mediaTable })
        .from(artistsTable)
        .leftJoin(mediaTable, eq(artistsTable.profileMediaID, mediaTable.id))
        .where(eq(artistsTable.featured, true))
        .orderBy(artistsTable.name, artistsTable.id)
    const featuredArtists = await Promise.all(featuredRows.map(async ({ artist, photo }, index) => ({
        id: artist.id,
        name: artist.name,
        slug: artist.slug,
        photo: photo ? await getMediaUrl(photo.objectKey) : null,
        color: colors[index % colors.length],
    })))

    const alignments = [
        "place-self-start",
        "place-self-end",
        "place-self-center",
    ]
    return(
        <div className="flex flex-col items-center max-w-full">
            <Hero size={"narrow"} source="/SVG/artistsHero.svg"></Hero>
            {featuredArtists.length > 0 && (
                <section className="w-full" aria-label="Featured artists">
                    <InfiniteHeader text="featured " repeats={1} direction="left" duration={20} />
                    <FeaturedArtists artists={featuredArtists} />
                </section>
            )}

            <InfiniteHeader text="artists " repeats={1} direction="left" duration={25} />
            <ArtistEdit />
            

            <div className="my-15 grid grid-cols-2 gap-x-3 gap-y-1">
                {artists.map((artist, index) => (
                    <ArtistCard key={index}
                    name={artist.name} 
                    slug={artist.slug}
                    src={""}
                    color={colors[index % colors.length]}
                    className={alignments[index % 2]}
                    />
                ))}
            </div>
        </div>
    )
}
