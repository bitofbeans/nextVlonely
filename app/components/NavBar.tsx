"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

export default function Nav() {
    const pathname = usePathname()
    return (
        <div className="absolute flex w-full justify-center py-4 sm:py-1">
            <nav className="flex w-full max-w-220 justify-evenly items-center text-center text-3xl sm:text-2xl md:text-3xl font-harmond">

                    <Link
                        href="/"
                        className={`text-pink px-3 py-2 sm:p-5 md:p-10 ${pathname == '/' ? 'underline decoration-1 underline-offset-2' : ''}`}
                    >
                        home
                    </Link>
                    <Image className='h-auto' src='/SVG/verticalStar.svg' alt="star" width={30} height={44.36} />
                    <Link
                        href="/archive"
                        className={`text-pink px-3 py-2 sm:p-5 md:p-10 ${pathname == '/archive' ? 'underline decoration-1 underline-offset-2' : ''}`}
                    >
                        archive
                    </Link>
                    <Image className='h-auto' src='/SVG/verticalStar.svg' alt="star" width={30} height={44.36} />
                    <Link
                        href="/artists"
                        className={`text-pink px-3 py-2 sm:p-5 md:p-10 ${pathname == '/artists' ? 'underline decoration-1 underline-offset-2' : ''}`}
                    >
                        artists
                    </Link>
            </nav>
    </div>
    )
}