import { getMediaUrl } from "@/lib/media"
import ShowCard from "./ShowCard"
import { ShowEditCollapsible } from "../components/ShowEdit"
import { ArtistOptionProvider } from "../components/ArtistOptionsProvider"
import { queryArtistOptions, queryShows } from "@/lib/queries"

export default async function UpcomingShows() {
    const shows = await queryShows({ type: "new"})
    const artistOptions = await queryArtistOptions() // initial artist options for context 

    if (shows.length >= 1) {
        return (
            <ArtistOptionProvider artistOptions={artistOptions}>
                <ShowEditCollapsible />
                {shows.map(async ({show, poster, artists}) => (
                    <div key={show.id}>
                        <ShowCard  {...show} artists={artists}
                        
                            imageUrl={poster ? await getMediaUrl(poster.objectKey) : null}    />
                        <ShowEditCollapsible defaultShow={show} defaultArtists={artists}/>   
                    </div>
                ))}
            </ArtistOptionProvider>
        )
    } else {
        return (
            <ArtistOptionProvider artistOptions={artistOptions}>
                <ShowEditCollapsible />
                <p className="m-10 my-20 text-3xl">
                    no upcoming shows yet, stay tuned...
                </p>
            </ArtistOptionProvider>
        )
    }
}