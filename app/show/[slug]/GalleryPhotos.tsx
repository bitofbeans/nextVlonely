"use client";

import { DeleteGalleryImageButton, MoveGalleryImageToBackButton } from "@/app/components/edit/GalleryEdit";
import Image from "next/image";
import { useState } from "react";

type GalleryPhoto = { id: number; objectKey: string, src: string };

export default function GalleryPhotos({ photos, showID }: { photos: GalleryPhoto[]; showID: number }) {
    const [landscapePhotos, setLandscapePhotos] = useState<Record<string, boolean>>({});

    return (
        <div className="grid grid-cols-2 grid-flow-row-dense gap-3 items-start">
            {photos.map((photo, index) => (
                <div key={photo.objectKey}>
                    <DeleteGalleryImageButton objectKey={photo.objectKey}/>
                    <MoveGalleryImageToBackButton showID={showID} objectKey={photo.objectKey} isLast={index === photos.length - 1}/>
                    <Image
                        alt={`Show photo ${index + 1}`}
                        src={photo.src}
                        width={500}
                        height={500}
                        sizes="(min-width: 60rem) 48rem, (min-width: 48rem) 80vw, 92vw"
                        className={`${landscapePhotos[photo.objectKey] ? "col-span-2" : ""} min-w-0 w-full h-auto`}
                        onLoad={(event) => {
                            const { naturalWidth, naturalHeight } = event.currentTarget;
                            setLandscapePhotos((previous) => ({
                                ...previous,
                                [photo.objectKey]: naturalWidth > naturalHeight,
                            }));
                        }}
                    />
                </div>
            ))}
        </div>
    );
}
