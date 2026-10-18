import { queryShowGalleryPhotos, type ShowWithArtists } from "@/lib/queries"
import { getMediaUrl } from "@/lib/media"
import Image from "next/image"
import Link from "next/link"
import ShowConveyerBelt from "./ShowConveyerBelt"

export default async function ShowCard({show, poster, artists}: ShowWithArtists ) {
    const photos = await queryShowGalleryPhotos(show.id)
    const galleryPhotos = await Promise.all(photos.map(async (photo) => ({
        id: photo.id,
        src: await getMediaUrl(photo.objectKey),
    })));

    return (
        <Link href={"/show/" + show.slug} className="flex items-center flex-col my-10">
            <div key={show.id} className="flex w-full justify-center items-center">
                <div className="absolute -z-10">
                    <ShowConveyerBelt photos={galleryPhotos} />
                </div>
                <Image className="border border-gray-700" width={250} height={500} alt="" src={poster ? await getMediaUrl(poster.objectKey) : "/SVG/placeholderPoster.svg"} />
            </div>
            <h1 className="px-4 py-3 text-3xl sm:text-5xl font-harmond font-black text-center">
                {show.title}
            </h1>
        </Link>
    )
}