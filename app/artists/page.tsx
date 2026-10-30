import { db } from "@/lib/db"
import Hero from "../components/Hero"
import InfiniteHeader from "../components/InfiniteHeader"
import ArtistCard from "./ArtistCard"
import { artistsTable } from "@/lib/db/schema"
import { colors } from "@/lib/helpers"

export default async function Artists() {
    const artists = await db.select()
        .from(artistsTable)

    const alignments = [
        "place-self-start",
        "place-self-end",
        "place-self-center",
    ]
    return(
        <div className="flex flex-col items-center max-w-full">
            <Hero size={"narrow"} source="/SVG/artistsHero.svg"></Hero>
            <InfiniteHeader text="featured " repeats={1} direction="left" duration={20} />
            <div className="my-20 text-5xl"> coming soon...</div>

            <InfiniteHeader text="artists " repeats={1} direction="left" duration={25} />
            

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