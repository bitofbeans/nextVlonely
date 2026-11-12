import Link from "next/link"

type ArtistCardProps = {
    name: string,
    slug: string,
    src: string | null,
    color: string
    className?: string | undefined
}
export default function ArtistCard({name, slug, src, color, className}: ArtistCardProps) {

    return (
        <Link href={"/artists/" + slug} 
        className={`max-w-full overflow-x-auto whitespace-nowrap lg:text-4xl md:text-3xl sm:text-3xl text-3xl underline underline-offset-8 decoration-1 text-${color} ${className}`}
        >
            {name}
        </Link>
    )

}
