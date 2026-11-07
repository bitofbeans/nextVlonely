"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

export default function Nav() {
    const pathname = usePathname()
    return (
        <div className="absolute flex w-full justify-center py-4 sm:py-1">
            <nav className="flex w-full max-w-220 flex-col xxs:flex-row justify-evenly items-center text-center text-3xl sm:text-2xl md:text-3xl font-harmond">

                    <Link
                        href="/"
                        className={`flex items-center gap-4 text-pink px-3 py-2 sm:p-5 md:p-10 ${pathname == '/' ? 'underline decoration-1 underline-offset-2' : ''}`}
                    >
                        <Image className="h-auto shrink-0 rotate-270 xxs:hidden" src="/SVG/verticalStar.svg" alt="" width={30} height={44.36} />
                        home
                    </Link>
                    <Image className='hidden h-auto xxs:block' src='/SVG/verticalStar.svg' alt="star" width={30} height={44.36} />
                    <Link
                        href="/archive"
                        className={`flex items-center gap-4 text-pink px-3 py-2 sm:p-5 md:p-10 ${pathname == '/archive' ? 'underline decoration-1 underline-offset-2' : ''}`}
                    >
                        <Image className="h-auto shrink-0 rotate-270 xxs:hidden" src="/SVG/verticalStar.svg" alt="" width={30} height={44.36} />
                        archive
                    </Link>
                    <Image className='hidden h-auto xxs:block' src='/SVG/verticalStar.svg' alt="star" width={30} height={44.36} />
                    <Link
                        href="/artists"
                        className={`flex items-center gap-4 text-pink px-3 py-2 sm:p-5 md:p-10 ${pathname == '/artists' ? 'underline decoration-1 underline-offset-2' : ''}`}
                    >
                        <Image className="h-auto shrink-0 rotate-270 xxs:hidden" src="/SVG/verticalStar.svg" alt="" width={30} height={44.36} />
                        friends
                    </Link>
            </nav>
    </div>
    )
}
