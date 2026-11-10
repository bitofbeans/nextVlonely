import { getMediaUrl } from "@/lib/media"
import ShowCard from "./ShowCard"
import { ShowEditCollapsible } from "../components/edit/ShowEdit"
import { ArtistOptionProvider } from "../components/edit/ArtistOptionsProvider"
import { queryArtistOptions, queryShows } from "@/lib/queries"

export default async function UpcomingShows() {
    const shows = await queryShows({ type: "new"})
    const artistOptions = await queryArtistOptions() // initial artist options for context 

    return (
        <ArtistOptionProvider artistOptions={artistOptions}>
            <ShowEditCollapsible />
            {shows.length >= 1 ? shows.map(async ({show, poster, artists}) => (
                <div key={show.id}>
                    <ShowCard  {...show} artists={artists}
                    
                        imageUrl={poster ? await getMediaUrl(poster.objectKey) : null}    />
                    <ShowEditCollapsible defaultShow={show} defaultArtists={artists}/>   
                </div>
            )) 
            : // length is 0
            <p className="m-10 my-20 text-3xl">
                no upcoming shows yet, stay tuned...
            </p>
            }
        </ArtistOptionProvider>
    )
}