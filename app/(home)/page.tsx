import Spacer from '../components/Spacer'
import InfiniteHeader from '../components/InfiniteHeader';
import Hero from '../components/Hero'
import HeroSVG from './HeroSVG'
import UpcomingShows from './UpcomingShows';
import Image from "next/image"


function About() {
    return (
        <section className="my-12 flex w-full max-w-280 flex-col gap-6 p-9 sm:my-15 sm:flex-row sm:gap-3">
            <div className="flex flex-row items-center justify-center gap-3 sm:flex-col sm:gap-1 sm:px-10 sm:py-2" >
                <a className="flex size-11 items-center justify-center" href="https://www.instagram.com/vlonelyandfriends/">
                    <Image src="/SVG/instagramLogo.svg" alt="instagram" width={50} height={50} />
                </a>
                <a className="flex size-11 items-center justify-center" href="https://posh.vip/g/vlonelyfriends">
                    <Image className="aspect-square" src="/SVG/poshLogo.svg" alt="posh" width={55} height={55} />
                </a>
            </div>
            <div className="flex min-w-0 flex-col gap-6 text-[clamp(1.75rem,8vw,2.8rem)] leading-tight sm:gap-12">
                <p>
                    we throw shows with our friends
                </p>
                <p>
                    events range from community networking to shows featuring some of your favorite underground artists
                </p>
                <p>
                    <strong>join vlonely&friends today!</strong>
                </p>
            </div>
        </section>
    )
}



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
            
            <InfiniteHeader text="about" repeats={1} direction="left" duration={20} />
            <About />

            <InfiniteHeader text="upcoming shows" repeats={1} direction="right" duration={39} />

            <UpcomingShows />

            <InfiniteHeader text="gallery" repeats={2} direction="left" duration={60} buttonText='past shows archive' buttonLink='/archive' buttonColor='text-white' />
            <Spacer spacing={5} />
            <InfiniteHeader text="artists" repeats={2} direction="right" duration={60} buttonText='artists showcase' buttonLink='/artists' buttonColor='text-white' />
            <Spacer spacing={5} />
        </div>
    );
}