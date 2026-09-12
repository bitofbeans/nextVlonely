import { db } from "@/lib/db"
import { mediaTable, showsTable } from "@/lib/db/schema"
import ShowCard from "./ShowCard"
import { getMediaUrl } from "@/lib/media"
import { eq } from "drizzle-orm"



export default async function UpcomingShows() {
    const rows = await db
        .select({ show: showsTable, poster: mediaTable })
        .from(showsTable)
        .leftJoin(mediaTable, eq(showsTable.posterMediaID, mediaTable.id))

    if (rows.length >= 1) {
        return (
            <div>
                {rows.map(({show, poster}) => (
                    <ShowCard key={show.id} {...show} 
                        imageUrl={poster ? getMediaUrl(poster.objectKey) : null}    />
                ))}
            </div>
        )
    } else {
        return (
            <p className="m-10 my-20 text-3xl">
                no upcoming shows yet, stay tuned...
            </p>
        )
    }
}