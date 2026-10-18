"use client"
import Image from "next/image";
import { gsap } from "gsap"
import { useEffect, useRef } from "react";
import { horizontalLoop } from "@/lib/helpers"

export default function ShowConveyerBelt({photos}: {photos: {id:number,src:string}[]}) {
    const trackRef = useRef<HTMLDivElement>(null);
    // TODO Moving queue for conveyer belt
    useEffect(()=>{
        const track = trackRef.current;
        if (!track || photos.length < 8) return;

        const context = gsap.context(() => {
            // Measure fixed frames so lazy-loaded images cannot change the loop geometry.
            horizontalLoop(Array.from(track.children), {paused: false, repeat: -1});
        }, track);

        return () => context.revert();
    }, [photos]);

    if (photos.length < 8) {
        return <div/>
    }

    return (
        <div className="w-screen overflow-clip">
            <div ref={trackRef} className="flex w-max flex-row">
                {photos.map((photo)=> (
                    <div key={`${photo.id}:${photo.src}`} className="relative h-40 w-60 shrink-0 bg-white/5">
                        <Image
                            className="object-cover opacity-0 transition-opacity duration-300"
                            alt=""
                            src={photo.src}
                            fill
                            sizes="240px"
                            loading="lazy"
                            onLoad={(event) => { event.currentTarget.style.opacity = "1"; }}
                            onError={(event) => { event.currentTarget.style.opacity = "0"; }}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

