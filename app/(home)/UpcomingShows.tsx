import { getMediaUrl } from "@/lib/media"
import ShowCard from "./ShowCard"
import { ShowEdit } from "./ShowEdit"
import { ArtistOptionProvider } from "./ArtistOptionsProvider"
import { queryArtistOptions, queryUpcomingShows } from "./_lib/queries"

export default async function UpcomingShows() {
    const shows = await queryUpcomingShows()
    const artistOptions = await queryArtistOptions() // initial artist options for context 

    if (shows.length >= 1) {
        return (
            <ArtistOptionProvider artistOptions={artistOptions}>
                <ShowEdit />
                {shows.map(({show, poster, artists}) => (
                    <div key={show.id}>
                        <ShowCard  {...show} artists={artists}
                        
                            imageUrl={poster ? getMediaUrl(poster.objectKey) : null}    />
                        <ShowEdit defaultShow={show} defaultArtists={artists}/>   
                    </div>
                ))}
            </ArtistOptionProvider>
        )
    } else {
        return (
            <ArtistOptionProvider artistOptions={artistOptions}>
                <ShowEdit />
                <p className="m-10 my-20 text-3xl">
                    no upcoming shows yet, stay tuned...
                </p>
            </ArtistOptionProvider>
        )
    }
}