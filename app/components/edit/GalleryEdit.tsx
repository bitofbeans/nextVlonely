"use client";
import { addPicsToGallery, deleteMediaByObjectKey, moveGalleryImageToBack } from "@/lib/actions";
import { useEditMode } from "./EditModeProvider";
import { XIcon } from "../Icons";
import { uploadMediaToCloudflare } from "@/lib/helpers";
import EditForm from "./EditForm";
import { useState } from "react";

const submitGalleryPhotoUpload = async (formData: FormData) => {
    
    const files = formData.getAll('files') as File[];


    for (const file of files) {
        const uuid = await uploadMediaToCloudflare(file)
        formData.append("uuids", uuid)
    }

    formData.delete("files")
    await addPicsToGallery(formData)
}


export function DeleteGalleryImageButton({objectKey}: {objectKey: string}) {
    const { isEditMode } = useEditMode();
    if (!isEditMode) return null;

    const deleteImage = async () => {
        await deleteMediaByObjectKey(objectKey)
    }
    return (
        <button className="cursor-pointer bg-red-600 pb-2 rounded-t-sm" onClick={deleteImage}>
            <XIcon className="z-20" />
        </button>
    )
}

export function MoveGalleryImageToBackButton({showID, objectKey, isLast}: {showID: number; objectKey: string; isLast: boolean}) {
    const { isEditMode } = useEditMode();
    const [pending, setPending] = useState(false);
    const [error, setError] = useState(false);
    if (!isEditMode) return null;

    const moveImage = async () => {
        setPending(true);
        setError(false);
        try {
            await moveGalleryImageToBack(showID, objectKey);
        } catch {
            setError(true);
        } finally {
            setPending(false);
        }
    };

    return (
        <>
            <button type="button" className="cursor-pointer rounded-t-sm bg-gray-700 px-2 py-1 text-xs text-white disabled:cursor-default disabled:opacity-50" onClick={moveImage} disabled={pending || isLast}>
                {pending ? "Moving..." : "Move to back"}
            </button>
            {error && <span role="alert" className="text-xs text-red-600">Could not move image. Try again.</span>}
        </>
    );
}

export function GalleryPhotoUploadCollapsible({showID}: { showID: number }) {
    return (
        <EditForm
            title={"Upload photos to Gallery"}
            action={submitGalleryPhotoUpload}
            submitText={"Upload images"}
            fields={{
                ...({ id: { type: "hidden" as const, value: showID } }),
                files: {
                    type: "file", label: "Upload files from your device",
                    multiple: true,
                    accept: "image/jpeg,image/png,image/webp",
                    help: "JPG, PNG or WebP.",
                },
            }}
        />
    );
}
