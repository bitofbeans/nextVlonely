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
            

            <div className="my-15 flex w-full max-w-3xl flex-col gap-y-1 px-4">
                {artists.filter((_, index) => index % 2 === 0).map((artist, pairIndex) => (
                    <div key={artist.id} className="flex flex-wrap items-baseline gap-x-3">
                        {artists.slice(pairIndex * 2, pairIndex * 2 + 2).map((member, index) => (
                            <ArtistCard key={member.id}
                                name={member.name}
                                slug={member.slug}
                                src={""}
                                color={colors[(pairIndex * 2 + index) % colors.length]}
                                className={index === 1 ? "ml-auto" : ""}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}
