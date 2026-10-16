"use client"
import { useRouter } from 'next/navigation'  // Usage: App router

export default function BackButton({className}: {className: string}) {
    const router = useRouter()

    const handleBack = () => {
        if (window.history.length > 1) {
        router.back();
        } else {
        router.push('/'); // Fallback to home if history is empty
        }
    };

    return (
        <button onClick={handleBack} className={`cursor-pointer max-w-max ${className}`}>&larr; back</button>
    )
}