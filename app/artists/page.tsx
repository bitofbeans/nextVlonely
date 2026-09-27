import { db } from "@/lib/db"
import Hero from "../components/Hero"
import InfiniteHeader from "../components/InfiniteHeader"
import { artistsTable } from "@/lib/db/schema"

export default async function Artists() {
    const artists = await db.select()
        .from(artistsTable)

    return(
        <div className="flex flex-col items-center max-w-full">
            <Hero size={"narrow"} source="/SVG/artistsHero.svg"></Hero>
            <InfiniteHeader text="showcase " repeats={1} direction="left" duration={20} />
            {artists.map((artist) => (
                <div key={artist.id}>
                    {artist.name}
                </div>
            ))}
        </div>
    )
}