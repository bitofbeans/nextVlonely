import Hero from "../components/Hero"
import InfiniteHeader from "../components/InfiniteHeader"

export default function Artists() {
    return(
        <div className="flex flex-col items-center max-w-full">
            <Hero size={"narrow"} source="/SVG/artistsHero.svg"></Hero>
            <InfiniteHeader text="showcase " repeats={1} direction="left" duration={20} />
        </div>
    )
}