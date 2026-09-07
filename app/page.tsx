import { db } from '@/db';
import { showsTable } from '@/db/schema';
import Image from "next/image";
import ShowCard from './components/ShowCard';
import InfiniteHeader from './components/InfiniteHeader';
import Hero from './components/Hero'


export default async function Home() {
    const upcomingShows = await db.select().from(showsTable);

    return (
        <div className="flex flex-col items-center max-w-full">
            <Hero />
            <InfiniteHeader text="upcoming shows" direction="left"/>
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
