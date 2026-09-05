import { db } from '@/db';
import { showsTable } from '@/db/schema';
import Image from "next/image";
import ShowCard from './components/ShowCard';


export default async function Home() {
    const upcomingShows = await db.select().from(showsTable);

    return (
        <div className="flex flex-col items-center">
            <Image 
                className="h-auto w-[min(90vw,1100px)] my-15"
                src="/vlonelyDark.png" 
                alt="vlonely" 
                width={1920} 
                height={1080}
            />
            <div className="flex border p-5 justify-center flex-col max-w-[90vw]">
                <div className="p-5">
                    <h1 className="text-center font-bold text-3xl font-harmond">upcoming shows</h1>
                </div>
                <div>
                    {upcomingShows.map((show) => {
                        return (
                            <ShowCard key={show.id} {...show} />
                        )
                    })}
                </div>
            </div>
        </div>
    );
}
