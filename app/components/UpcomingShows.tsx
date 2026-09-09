import { db } from "@/lib/db"
import { showsTable } from "@/lib/db/schema"
import ShowCard from "./ShowCard"



export default async function UpcomingShows() {
    const getDate = (str: string) => {
        const dateObject = new Date(str)
        return dateObject.toLocaleString(undefined, {
            day: "numeric",
            month: "long",
            hour: "numeric"
        })
    }

    const shows = await db.select().from(showsTable)

    return (
        <div>
            {shows.map((show, index)=>{
                return (
                    <ShowCard key={index}  {...show} />
                )
            })}
        </div>
    )
}