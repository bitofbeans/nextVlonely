import type { ShowWithArtists } from "@/lib/queries"
import { getMediaUrl } from "@/lib/media"
import Image from "next/image"
import Link from "next/link"

export default function ShowCard({show, poster, artists}: ShowWithArtists ) {

    return (
        <div key={show.id} className="flex w-full justify-center">
            <Link href={"/show/" + show.slug} className="flex items-center flex-col">
                <Image className="border border-white" width={350} height={500} alt="" src={poster ? getMediaUrl(poster.objectKey) : "/SVG/placeholderPoster.svg"} />
                <h1 className="p-4 text-5xl font-harmond font-black">
                    {show.title}
                </h1>
            </Link>
            
        </div>
    )
}