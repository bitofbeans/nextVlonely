import Image from 'next/image'
import type { CSSProperties } from 'react'

type SVGProps = {
    src: string,
    top?: number,
    left?: number,
    scale?: number,
    delay?: number,
    duration?: number,
    distance?: number,
    variant?: 'float' | 'float-rotate' | 'float-2' | 'wiggle' | 'spin-slow',
}

const variantClass: Record<NonNullable<SVGProps['variant']>, string> = {
    'float': 'animate-float',
    'float-rotate': 'animate-float-rotate',
    'float-2': 'animate-float-2',
    'wiggle': 'animate-wiggle',
    'spin-slow': 'animate-spin-slow',
}

export default function AnimatedSVG({ src, top = 0, left = 0, scale = 100, delay, duration, distance = 0, variant = 'float' }: SVGProps) {
    const style: CSSProperties = {
        top: `${top}%`,
        left: `${left}%`,
        width: `${scale}%`,
        ...(delay !== undefined ? { animationDelay: `${delay}s` } : null),
        ...(duration !== undefined ? { animationDuration: `${duration}s` } : null),
        ...(distance !== undefined ? { '--float-distance': `${distance}px` }: null),
    }
    return (
        <Image src={src} alt="" aria-hidden
        width={120} height={120}
        className={`absolute pointer-events-none h-auto ${variantClass[variant]}`}
        style={style} loading='eager' />
    )
}