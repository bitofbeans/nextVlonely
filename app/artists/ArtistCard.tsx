import Link from "next/link"

type ArtistCardProps = {
    name: string,
    slug: string,
    src: string | null,
    color: string
    className?: string | undefined
}
export default function ArtistCard({name, slug, src, color, className}: ArtistCardProps) {
    
    if (src != null) {
        return (
            <Link href={"/artists/" + slug} 
            className={`lg:text-4xl md:text-3xl sm:text-3xl text-3xl underline underline-offset-8 decoration-1 text-${color} ${className}`}
            >
                {name}
            </Link>
        )
    } else {
        // return (
        //     // <Image src={"s"}></Image>
        // )
    }
}