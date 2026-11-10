"use client";
import { addPicsToGallery, deleteMediaByObjectKey } from "@/lib/actions";
import { useEditMode } from "./EditModeProvider";
import { CaretRightIcon, XIcon } from "../Icons";
import { Collapsible } from "@base-ui/react";
import { useFormStatus } from "react-dom";
import { uploadMediaToCloudflare } from "@/lib/helpers";
import EditForm from "./EditForm";

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

export function GalleryPhotoUploadCollapsible({showID}: { showID: number }) {
    return (
        <EditForm
            title={"Upload photos to Gallery"}
            action={submitGalleryPhotoUpload}
            submitText={"Upload images"}
            fields={{
                ...({ id: { type: "hidden" as const, value: showID } }),
                poster: {
                    type: "file", label: "Upload files from your device",
                    accept: "image/jpeg,image/png,image/webp",
                    help: "JPG, PNG or WebP.",
                },
            }}
        />
    );
}