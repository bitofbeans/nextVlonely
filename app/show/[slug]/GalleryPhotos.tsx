"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./Gallery.module.css";

type GalleryPhoto = { id: number; src: string };

export default function GalleryPhotos({ photos }: { photos: GalleryPhoto[] }) {
    const [landscapePhotos, setLandscapePhotos] = useState<Record<number, boolean>>({});

    return (
        <div className="grid grid-cols-2 grid-flow-row-dense gap-3 items-start">
            {photos.map((photo, index) => (
                <Image
                    key={photo.id}
                    alt={`Show photo ${index + 1}`}
                    src={photo.src}
                    width={500}
                    height={500}
                    sizes="(min-width: 60rem) 48rem, (min-width: 48rem) 80vw, 92vw"
                    className={`${styles.image} ${landscapePhotos[photo.id] ? "col-span-2" : ""} block min-w-0 w-full h-auto`}
                    onLoad={(event) => {
                        const { naturalWidth, naturalHeight } = event.currentTarget;
                        setLandscapePhotos((previous) => ({
                            ...previous,
                            [photo.id]: naturalWidth > naturalHeight,
                        }));
                    }}
                />
            ))}
        </div>
    );
}
