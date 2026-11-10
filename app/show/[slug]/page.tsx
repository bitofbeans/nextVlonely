import { queryArtistOptions, queryShows } from "@/lib/queries"
import BackButton from "@/app/components/BackButton"
import InfiniteHeader from "@/app/components/InfiniteHeader"
import Image from "next/image"
import Link from "next/link"

import { getMediaUrl } from "@/lib/media"
import { ShowEditCollapsible } from "@/app/components/edit/ShowEdit"
import { ArtistOptionProvider } from "@/app/components/edit/ArtistOptionsProvider"
import Gallery from "./Gallery"
import { colors, dateFormat } from "@/lib/helpers"

const artistColors = colors.map((color) => `text-${color}`)

const eyebrowClassName = "font-harmond text-sm font-bold uppercase text-white"

export default async function Show({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const [showData] = await queryShows({ type: "all", slug })
    const { show, poster, artists } = showData
    const { id, title, description, venue, date } = show
    const artistOptions = await queryArtistOptions()

    return (
        <ArtistOptionProvider artistOptions={artistOptions}>
            <div className="mx-auto flex w-[92vw] max-w-6xl flex-col items-center pt-48 xxs:pt-32 md:pt-36">
                <BackButton className="mb-4 self-start py-2 font-harmond text-xl text-pink hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink" />
                <h1 className="sr-only">{title}</h1>
                <div aria-hidden="true" className="w-screen min-w-0">
                    <InfiniteHeader text={title} repeats={1} direction="right" duration={60} />
                </div>

                <ShowEditCollapsible defaultShow={show} defaultArtists={artists} />

                <div className="mt-8 grid w-full min-w-0 items-center gap-6 md:grid-cols-2 md:gap-8 lg:gap-10">
                    <Image
                        width={350}
                        height={500}
                        alt={`${title} show poster`}
                        src={poster ? await getMediaUrl(poster.objectKey) : "/SVG/placeholderPoster.svg"}
                        sizes="(min-width: 1280px) 556px, (min-width: 768px) 44vw, 92vw"
                        className="h-auto w-full"
                    />

                    <div className="flex min-w-0 flex-col gap-6 md:gap-8">
                        <section aria-label="Show details" className="rounded-2xl border border-white/15 bg-white/3 px-6 py-7 sm:px-8 sm:py-8">
                            <h2 className={eyebrowClassName}>Date</h2>
                            <p className="mt-3 font-elgoc text-2xl leading-snug text-white [overflow-wrap:anywhere] sm:text-3xl">
                                {dateFormat(date)}
                            </p>
                            <hr className="my-6 border-white/30" />
                            <h2 className={eyebrowClassName}>Venue</h2>
                            <p className="mt-3 font-elgoc text-2xl leading-snug text-white [overflow-wrap:anywhere] sm:text-3xl">
                                {venue}
                            </p>
                        </section>

                        <section aria-labelledby="show-artists" className="rounded-2xl border border-white/15 bg-white/3 px-6 py-7 sm:px-8 sm:py-8">
                            <h2 id="show-artists" className={eyebrowClassName}>Artists</h2>
                            <hr className="my-5 border-white/30" />
                            <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,12rem),1fr))] gap-x-4 gap-y-1 font-elgoc text-2xl leading-tight sm:text-3xl">
                                {artists.map((artist, index) => (
                                    <li key={artist.id}>
                                        <Link
                                            href={`/artists/${artist.slug}`}
                                            className={`${artistColors[index % artistColors.length]} [overflow-wrap:anywhere] decoration-1 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current`}
                                        >
                                            {artist.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>
                </div>

                <section aria-labelledby="show-description" className="mt-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/15 bg-white/3 sm:mt-14">
                    <h2 id="show-description" className="bg-white px-6 py-2 font-harmond text-xl font-bold text-black sm:text-2xl">
                        DESCRIPTION
                    </h2>
                    <div className="p-6">
                        <p className="mx-auto max-w-lg font-elgoc text-xl leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere]">
                            {description}
                        </p>
                    </div>
                </section>

                <div className="mt-14 w-screen min-w-0 font-harmond font-bold">
                    <InfiniteHeader text="gallery " repeats={1} direction="left" duration={60} />
                </div>
                <Gallery showID={id} />
            </div>
        </ArtistOptionProvider>
    )
}
