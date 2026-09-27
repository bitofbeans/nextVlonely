import Hero from "../components/Hero"
import InfiniteHeader from "../components/InfiniteHeader"
import { queryShows } from "@/lib/queries"

export default async function Archive() {
    const shows = await queryShows("old")
    return(
        <div className="flex flex-col items-center max-w-full">
            <Hero source="/SVG/archiveHero.svg"></Hero>

            <p></p>

            <InfiniteHeader text="past shows " repeats={1} direction="right" duration={19} />

            {shows.map(({show, poster, artists},)=> (
                <div key={show.id}>
                    {show.title}
                </div>
            ))}
            
            <InfiniteHeader text="upcoming shows " repeats={2} direction="right" duration={59} buttonLink="/" buttonText="looking for new shows?" />
        </div>
    )
}