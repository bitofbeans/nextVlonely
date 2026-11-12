"use client"
import { useRouter } from 'next/navigation'  // Usage: App router

export default function BackButton() {
    const router = useRouter()

    const handleBack = () => {
        if (window.history.length > 1) {
        router.back();
        } else {
        router.push('/'); // Fallback to home if history is empty
        }
    };

    return (
        <button onClick={handleBack} className="mb-4 max-w-max cursor-pointer self-start py-2 font-harmond text-xl text-pink hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink">&larr; back</button>
    )
}
