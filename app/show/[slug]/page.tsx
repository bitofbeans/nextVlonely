import { queryArtistOptions, queryShows } from "@/lib/queries"
import BackButton from "@/app/components/BackButton"
import InfiniteHeader from "@/app/components/InfiniteHeader"
import Image from "next/image"
import Link from "next/link"

import { getMediaUrl } from "@/lib/media"
import { ExternalIcon } from "@/app/components/Icons"
import { ShowEditCollapsible } from "@/app/components/ShowEdit"
import { ArtistOptionProvider } from "@/app/components/ArtistOptionsProvider"
import Gallery from "./Gallery"
import { dateFormat } from "@/lib/helpers"


export default async function Show({ params }: { params: Promise<{ slug: string }>}) {
    const { slug } = await params
    
    const [showData] = await queryShows({ type: "all", slug: slug })

    const { show, poster, artists } = showData

    const { id, title, description, venue, date, ticketUrl } = show

    const ticketButton = ticketUrl != null ? <Link href={ticketUrl}>tickets here</Link> : ""
    
    const artistOptions = await queryArtistOptions()
    const colors = [
		"pink",
		"yellow",
		"orange",
		"purple",
		"blue",
		"teal",
		"green"
	]
    const ticketLink = ticketUrl ?? ""
    return(
        
        <ArtistOptionProvider artistOptions={artistOptions}>
            <div className="flex flex-col items-center justify-center w-full">
                <div className="flex flex-col items-center max-w-[95vw] ">
                    <div className="m-16" />
                    <BackButton className={"px-5 py-2 m-"} />
                    <Image width={350} height={500} alt="" src={poster ? await getMediaUrl(poster.objectKey) : "/SVG/placeholderPoster.svg"} />
                    <div className="relative font-harmond font-black max-w-full mt-6">
                        <InfiniteHeader text={title} repeats={1} direction="right" duration={60} />

                    </div>
                    <ShowEditCollapsible defaultShow={show} defaultArtists={artists}/>   
                    <section className="my-5 flex flex-col items-center border border-white/15 rounded-2xl bg-white/3 p-6 w-full max-w-2xl font-harmond font-black text-3xl">
                        artists:
                        <div className="">
                            <div className="font-elgoc text-balance text-center">
                                {artists.map((artist, index) => {
                                    const textColor = colors[index % colors.length]
                                    if (artist) return (
                                        <div key={index} className="inline-block">
                                            <Link href={"/artists/" + artist.slug} className={`flex justify-center cursor-pointer whitespace-pre text-${textColor}`}>
                                                {artist.name}
                                                <p className="text-white inline-block">{index != artists.length - 1 ? " / " : ""}</p>
                                            </Link>
                                            
                                        </div>
                                    
                                    )
                                    else return <div key={index}></div>
                                })}
                            </div>
                        </div>
                    </section>
                    <section className="flex flex-col items-center border border-white/15 rounded-2xl bg-white/3 p-6 w-full max-w-2xl font-harmond font-black">
                        <h1 className="text-2xl mt-4">
                            DATE
                        </h1>
                        <h2 className="font-elgoc font-medium text-xl mb-2">
                            {dateFormat(show.date)}
                        </h2>
                        <h1 className="text-2xl">
                            DESCRIPTION
                        </h1>
                        <p className="max-w-lg font-elgoc font-medium text-xl whitespace-pre-wrap break-normal">
                            {description}
                        </p>

                    </section>
                    <div className="font-harmond font-black max-w-full mt-14">
                        <InfiniteHeader text={"gallery "} repeats={1} direction="left" duration={60} />
                    </div>
                    <Gallery showID={id} />
                </div>
            </div>
        </ArtistOptionProvider>
    )
}