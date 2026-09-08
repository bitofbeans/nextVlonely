import { db } from "@/lib/db"
import { showsTable } from "@/lib/db/schema"



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
                    <div key={index} className="text-5xl my-20">
                        <pre  className="text-white/20">{show.id}</pre>
                        <h1 className="text-pink">
                            {show.title}
                        </h1>
                        <p className="text-purple text-3xl">{getDate(show.date)}</p>
                        <p className="text-blue text-3xl">{show.venue}</p>
                        <p className="text-lg">{show.description}</p>
                    </div>
                )
            })}
        </div>
    )
}