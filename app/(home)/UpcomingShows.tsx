import { db } from "@/lib/db"
import { mediaTable, showsTable } from "@/lib/db/schema"
import { getMediaUrl } from "@/lib/media"
import { desc, eq } from "drizzle-orm"
import ShowCard from "./ShowCard"
import { ShowEdit } from "./EditMode"




export default async function UpcomingShows() {
    const rows = await db
        .select({ show: showsTable, poster: mediaTable })
        .from(showsTable)
        .orderBy(desc(showsTable.date))
        .leftJoin(mediaTable, eq(showsTable.posterMediaID, mediaTable.id))

    if (rows.length >= 1) {
        return (
            <div>
                <ShowEdit />
                {rows.map(({show, poster}) => (
                    <div key={show.id}>
                        <ShowCard  {...show} 
                            imageUrl={poster ? getMediaUrl(poster.objectKey) : null}    />
                        <ShowEdit defaultShow={show} />   
                    </div>
                ))}
            </div>
        )
    } else {
        return (
            <div>
                <ShowEdit />
                <p className="m-10 my-20 text-3xl">
                    no upcoming shows yet, stay tuned...
                </p>
            </div>
        )
    }
}