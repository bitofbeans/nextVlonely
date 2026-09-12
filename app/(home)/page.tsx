import { db } from '@/lib/db';
import { showsTable } from '@/lib/db/schema';
import Image from "next/image";
import Spacer from '../components/Spacer'
import ShowCard from './ShowCard';
import InfiniteHeader from '../components/InfiniteHeader';
import Hero from '../components/Hero'
import HeroSVG from './HeroSVG'
import About from './About';
import UpcomingShows from './UpcomingShows';




export default async function Home() {
    return (
        <div className="flex flex-col items-center max-w-full">
            <Hero source="/SVG/vlonelyWhite.svg">
                {/* Decorations */}
                <HeroSVG src="/SVG/pinkHeart.svg" top={40} left={9} scale={7} variant="float" duration={5} delay={0} distance={-12} />
                <HeroSVG src="/SVG/orangeStar.svg" top={34} left={18} scale={7} variant="spin-slow" duration={14} delay={-4} />
                <HeroSVG src="/SVG/lightPinkHeart.svg" top={20.5} left={39.5} scale={7} variant="float-2" duration={7} delay={-3} distance={-18} />
                <HeroSVG src="/SVG/blueStar.svg" top={12.5} left={47.5} scale={7} variant="wiggle" duration={4.5} delay={-1.5} />
                {/* Text */}
                <HeroSVG src="/SVG/andText.svg" top={70} left={66} scale={10} variant="float-rotate" duration={6} delay={-2} distance={-1} />
                <HeroSVG src="/SVG/friendsText.svg" top={77.5} left={54.2} scale={35} variant="float" duration={5.8} delay={-4.2} distance={12} />
            </Hero>
            
            <InfiniteHeader text="about" repeats={3} direction="left" duration={20} />
            <About />

            <InfiniteHeader text="upcoming shows" repeats={3} direction="right" duration={39} />

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