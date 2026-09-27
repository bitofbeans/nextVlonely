import { queryArtistBySlug } from "@/lib/queries"
import BackButton from "@/app/components/BackButton"
import InfiniteHeader from "@/app/components/InfiniteHeader"


export default async function Artist({ params }: { params: Promise<{ slug: string }>}) {
    const { slug } = await params
    
    const artistData = await queryArtistBySlug(slug)

    let { id, name, instagramHandle, instagramUrl, description } = artistData

    description = description ?? "...no description..."
    return(
        <div className="flex flex-col items-center justify-center w-full h-[90vh]">
            <div className="flex flex-col">

                <BackButton className={"px-5 py-2"} />

                <section className="flex flex-col items-center border border-white/15 rounded-2xl bg-white/3 p-6 w-full max-w-[75vw] font-harmond font-black">

                    <InfiniteHeader buttonText={name} text={name} repeats={1} direction="right" duration={27} />
                    <p className="max-w-lg font-elgoc py-3">
                        {description}
                    </p>
                </section>
                
            </div>
        </div>
    )
}