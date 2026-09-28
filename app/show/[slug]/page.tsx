import { queryArtistBySlug, queryShows } from "@/lib/queries"
import BackButton from "@/app/components/BackButton"
import InfiniteHeader from "@/app/components/InfiniteHeader"
import Image from "next/image"
import Spacer from "../../components/Spacer"
import { getMediaUrl } from "@/lib/media"


export default async function Show({ params }: { params: Promise<{ slug: string }>}) {
    const { slug } = await params
    
    const [showData] = await queryShows({ type: "all", slug: slug })

    const { show, poster, artists } = showData

    const { id, title, description, venue, date } = show


    return(
        <div className="flex flex-col items-center justify-center w-full">
            <div className="flex flex-col items-center max-w-full ">
                <div className="m-16" />
                <BackButton className={"px-5 py-2 m-"} />
                <Image className="border border-white" width={350} height={500} alt="" src={poster ? getMediaUrl(poster.objectKey) : "/SVG/placeholderPoster.svg"} />
                <div className="font-harmond font-black max-w-full m-6">
                    <InfiniteHeader buttonText={title} text={title} repeats={1} direction="right" duration={60} />
                </div>
                <section className="flex flex-col items-center border border-white/15 rounded-2xl bg-white/3 p-6 w-full max-w-2xl font-harmond font-black">

                    <p className="max-w-lg font-elgoc font-medium text-xl py-3 whitespace-pre-wrap break-normal">
                        {description}
                    </p>
                </section>
                
            </div>
        </div>
    )
}