import imageCompression from "browser-image-compression"
import { getUploadMediaUrl } from "./media"

export const colors = [
        "pink",
        "yellow",
        "orange",
        "purple",
        "blue",
        "teal",
        "green"
]

export function dateFormat(date: Date) {
    const dateObject = new Date(date)
    
    const dateConfig: Intl.DateTimeFormatOptions = {
      month: "long",
      weekday: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }

    const localDateTime = new Intl.DateTimeFormat("en-US", dateConfig).format(dateObject)
    return String(localDateTime)
}


export async function compressImage(file: File) {
    if (file != undefined && file.size > 1) {
        const compressed = await imageCompression(file, {
            maxWidthOrHeight: 1600,
            fileType: "image/webp"
        })
        return compressed
    }
    return file
}

export async function uploadMediaToCloudflare(file: File) {
 
    const uuid = crypto.randomUUID()
    
    const uploadUrl = await getUploadMediaUrl(uuid, file.type)
    const response = await fetch(uploadUrl, {
            method: "PUT",
            body: file,
            headers: {
                "Content-Type": file.type,
            },
            mode: "cors"
    })
    if (!response.ok) { throw new Error("Upload failed")}
    return uuid
} 