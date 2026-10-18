"use client";

import { DeleteGalleryImageButton } from "@/app/components/ShowEdit";
import Image from "next/image";
import { useState } from "react";

type GalleryPhoto = { id: number; objectKey: string, src: string };

export default function GalleryPhotos({ photos }: { photos: GalleryPhoto[] }) {
    const [landscapePhotos, setLandscapePhotos] = useState<Record<number, boolean>>({});

    return (
        <div className="grid grid-cols-2 grid-flow-row-dense gap-3 items-start">
            {photos.map((photo, index) => (
                <div key={photo.id}>
                    <DeleteGalleryImageButton objectKey={photo.objectKey}/>
                    <Image
                        alt={`Show photo ${index + 1}`}
                        src={photo.src}
                        width={500}
                        height={500}
                        sizes="(min-width: 60rem) 48rem, (min-width: 48rem) 80vw, 92vw"
                        className={`${landscapePhotos[photo.id] ? "col-span-2" : ""} min-w-0 w-full h-auto`}
                        onLoad={(event) => {
                            const { naturalWidth, naturalHeight } = event.currentTarget;
                            setLandscapePhotos((previous) => ({
                                ...previous,
                                [photo.id]: naturalWidth > naturalHeight,
                            }));
                        }}
                    />
                </div>
            ))}
        </div>
    );
}
