"use client"
import { useRouter } from 'next/navigation'  // Usage: App router

export default function BackButton({className}: {className: string}) {
    const router = useRouter()
    return (
        <button onClick={router.back} className={`cursor-pointer max-w-max ${className}`}>&larr; back</button>
    )
}