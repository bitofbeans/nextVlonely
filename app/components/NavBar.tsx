"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'


const navLinks = [
  { name: 'home', href: "/" },
  { name: 'archive', href: "/archive" },
  { name: 'artists', href: "/artists" }
];

export default function Nav() {
    const pathname = usePathname()
    return (
        <nav className="flex flex-wrap w-full max-w-220 justify-evenly items-center text-center text-xl sm:text-2xl md:text-3xl font-harmond">
          {navLinks.map((link) => {
            const isActive = pathname == link.href;

            return (
                <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 sm:p-5 md:p-10 ${isActive ? 'underline decoration-1 underline-offset-2' : ''}`}

                >
                    {link.name}
                </Link>
            );
          })}
        </nav>
    )
}