import Hero from "../components/Hero"
import InfiniteHeader from "../components/InfiniteHeader"


export default function Archive() {
    return(
        <div className="flex flex-col items-center max-w-full">
            <Hero source="/SVG/archiveHero.svg"></Hero>

            <p></p>

            <InfiniteHeader text="past shows " repeats={1} direction="right" duration={19} />

            <InfiniteHeader text="upcoming shows " repeats={2} direction="right" duration={59} buttonLink="/" buttonText="looking for new shows?" />
        </div>
    )
}