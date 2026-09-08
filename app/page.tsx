import { db } from '@/lib/db';
import { showsTable } from '@/lib/db/schema';
import Image from "next/image";
import Spacer from './components/Spacer'
import ShowCard from './components/ShowCard';
import InfiniteHeader from './components/InfiniteHeader';
import Hero from './components/Hero'
import About from './components/About';
import UpcomingShows from './components/UpcomingShows';


export default async function Home() {
    const upcomingShows = await db.select().from(showsTable);

    return (
        <div className="flex flex-col items-center max-w-full">
            <Hero />
            
            <InfiniteHeader text="about" repeats={4} direction="left" duration={20} />
            <About />

            <InfiniteHeader text="upcoming shows" repeats={4} direction="right" duration={39} />

            <UpcomingShows />

            <InfiniteHeader text="gallery" repeats={2} direction="left" duration={60} buttonText='past shows archive' buttonLink='/archive' buttonColor='text-white' />
            <Spacer spacing={5} />
            <InfiniteHeader text="artists" repeats={2} direction="right" duration={60} buttonText='artists showcase' buttonLink='/artists' buttonColor='text-white' />
            <Spacer spacing={5} />
        </div>
    );
}

/*
            <div className="flex border p-5 justify-center flex-col max-w-[90vw]">
                <div className="p-5">
                </div>
                <div>
                    {upcomingShows.map((show) => {
                        return (
                            <ShowCard key={show.id} {...show} />
                        )
                    })}
                </div>
            </div>
            */