"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { gsap } from "gsap"
import styles from "./FeaturedArtists.module.css"

type FeaturedArtist = {
    id: number
    name: string
    slug: string
    photo: string | null
    color: string
}

export default function FeaturedArtists({ artists }: { artists: FeaturedArtist[] }) {
    const container = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const media = gsap.matchMedia(container)
        media.add({
            mobile: "(max-width: 767px)",
            desktop: "(min-width: 768px)",
            motion: "(prefers-reduced-motion: no-preference)",
        }, (context) => {
            if (!context.conditions?.motion) return
            const duration = context.conditions.mobile ? 1 : 0.5
            const rows = gsap.utils.toArray<HTMLElement>("[data-featured-row]").flatMap((row) => {
                const strip = row.querySelector("[data-featured-strip]")
                return strip ? [{ row, strip, moveX: gsap.quickTo(strip, "x", { duration, ease: "power3.out" }) }] : []
            })
            let frame = 0
            const update = (immediate = false) => {
                frame = 0
                const viewportCenter = window.innerHeight / 2
                const speed = Math.min(window.innerWidth * 0.56, 720) / window.innerHeight
                const positions = rows.map(({ row }) => {
                    const bounds = row.getBoundingClientRect()
                    return (bounds.top + bounds.height / 2 - viewportCenter) * speed
                })
                rows.forEach(({ strip, moveX }, index) => {
                    if (immediate) gsap.set(strip, { x: positions[index] })
                    else moveX(positions[index])
                })
            }
            const scheduleUpdate = () => {
                if (!frame) frame = requestAnimationFrame(() => update())
            }
            update(true)
            window.addEventListener("scroll", scheduleUpdate, { passive: true })
            window.addEventListener("resize", scheduleUpdate)
            return () => {
                window.removeEventListener("scroll", scheduleUpdate)
                window.removeEventListener("resize", scheduleUpdate)
                cancelAnimationFrame(frame)
                gsap.set(rows.map(({ strip }) => strip), { clearProps: "transform" })
            }
        })
        return () => media.revert()
    }, [])

    return (
        <div ref={container} className={styles.list}>
            {artists.map((artist) => (
                <Link key={artist.id} href={`/artists/${artist.slug}`} className={styles.row} data-featured-row>
                    <div className={styles.strip} data-featured-strip>
                        {Array.from({ length: 9 }, (_, index) => {
                            const distance = Math.abs(index - 4)
                            return (
                                <div key={index} className={`${styles.tile} ${distance === 0 ? styles.main : styles.echo} ${styles[`distance${distance}`]}`} aria-hidden="true">
                                    {distance === 0 && <span className={styles.name} style={{ color: `var(--color-${artist.color})` }}>{artist.name}</span>}
                                    <div className={styles.portrait}>
                                        {artist.photo ? (
                                            <Image src={artist.photo} alt="" fill loading="eager" sizes="(max-width: 600px) 58vw, 320px" className={styles.image} />
                                        ) : (
                                            <span className={styles.initial}>{artist.name.charAt(0)}</span>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <span className="sr-only">View {artist.name}</span>
                </Link>
            ))}
        </div>
    )
}
