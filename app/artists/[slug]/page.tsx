import { queryArtistBySlug } from "@/lib/queries"
import BackButton from "@/app/components/BackButton"
import InfiniteHeader from "@/app/components/InfiniteHeader"
import ArtistEdit from "@/app/components/edit/ArtistEdit"
import { db } from "@/lib/db"
import { mediaTable } from "@/lib/db/schema"
import { getMediaUrl } from "@/lib/media"
import { eq } from "drizzle-orm"
import Image from "next/image"
import { notFound } from "next/navigation"


export default async function Artist({ params }: { params: Promise<{ slug: string }>}) {
    const { slug } = await params
    
    const artistData = await queryArtistBySlug(slug)
    if (!artistData) notFound()

    const { name, instagramHandle, instagramUrl, description, profileMediaID } = artistData
    const [profileMedia] = profileMediaID
        ? await db.select().from(mediaTable).where(eq(mediaTable.id, profileMediaID))
        : []

    return(
        <div className="flex flex-col items-center justify-center w-full min-h-[90vh] pb-12 pt-48 xxs:pt-32 md:pt-36">
            <div className="flex flex-col w-full max-w-3xl px-4">

                <BackButton />
                <ArtistEdit artist={artistData} />

                <section className="flex flex-col items-center border border-white/15 rounded-2xl bg-white/3 p-6 w-full font-harmond font-black">

                    <InfiniteHeader buttonText={name} text={name} repeats={1} direction="right" duration={27} />
                    {profileMedia && (
                        <Image src={await getMediaUrl(profileMedia.objectKey)} alt={`${name} profile photo`} width={320} height={320} className="mt-4 aspect-square w-full max-w-80 rounded-xl object-cover" />
                    )}
                    <p className="max-w-lg font-elgoc py-3">
                        {description ?? "...no description..."}
                    </p>
                    {instagramUrl && (
                        <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 font-elgoc text-pink underline underline-offset-4">
                            <Image src="/SVG/instagramLogo.svg" alt="" width={28} height={28} />
                            {instagramHandle || "Instagram"}
                        </a>
                    )}
                    {!instagramUrl && instagramHandle && (
                        <p className="flex items-center gap-3 font-elgoc text-pink">
                            <Image src="/SVG/instagramLogo.svg" alt="" width={28} height={28} />
                            {instagramHandle}
                        </p>
                    )}
                </section>
                
            </div>
        </div>
    )
}
