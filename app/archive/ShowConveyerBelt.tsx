"use client"
import Image from "next/image";
import { gsap } from "gsap"
import { useEffect } from "react";
import { horizontalLoop } from "@/lib/helpers"

export default function ShowConveyerBelt({photos}: {photos: {id:number,src:string}[]}) {

    if (photos.length < 8) {
        return <div/>
    }

    useEffect(()=>{
        const images = gsap.utils.toArray("#img-belt");
        const loop = horizontalLoop(images, {paused: false, repeat: -1});

    })

    return (
        <div className="overflow-clip">
            <div className="flex flex-row">
                {photos.map((photo)=> (
                    <Image id="img-belt" className="max-h-40" alt="Show BG Image" key={photo.id} src={photo.src} width={500} height={100} />
                ))}
            </div>
        </div>
    )
}

