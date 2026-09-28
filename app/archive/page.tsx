import Hero from "../components/Hero"
import InfiniteHeader from "../components/InfiniteHeader"
import { queryArtistOptions, queryShows } from "@/lib/queries"
import { ArtistOptionProvider } from "../components/ArtistOptionsProvider"
import { ShowEdit } from "../components/ShowEdit"
import ShowCard from "./ShowCard"


export default async function Archive() {
    const shows = await queryShows({ type: "old"})
    const artistOptions = await queryArtistOptions() // initial artist options for context 
    
    return(
        <div className="flex flex-col items-center max-w-full">
            <Hero source="/SVG/archiveHero.svg"></Hero>

            <p></p>

            <InfiniteHeader text="past shows " repeats={1} direction="right" duration={19} />

            <div className="m-10">
                <ArtistOptionProvider artistOptions={artistOptions}>
                    <ShowEdit />
                    {shows.map((showData, index)=> (
                        <ShowCard key={index} {...showData} />
                    ))}
                </ArtistOptionProvider>
            </div>
            
            <InfiniteHeader text="upcoming shows " repeats={2} direction="right" duration={59} buttonLink="/" buttonText="looking for new shows?" />
        </div>
    )
}