"use client";

import type { artistsTable } from "@/lib/db/schema";
import { deleteArtist, postArtist } from "@/lib/actions";
import { compressImage, uploadMediaToCloudflare } from "@/lib/helpers";
import EditForm from "./EditForm";

type Artist = typeof artistsTable.$inferSelect;

async function submitArtist(formData: FormData) {
    const photo = formData.get("profilePhoto");
    if (photo instanceof File && photo.size > 0) {
        const objectKey = await uploadMediaToCloudflare(await compressImage(photo));
        formData.set("profile-uuid", objectKey);
    }
    formData.delete("profilePhoto");
    await postArtist(formData);
}

export default function ArtistEdit({ artist }: { artist?: Artist }) {
    return (
        <EditForm
            title={artist ? `Edit ${artist.name}` : "Add artist"}
            action={submitArtist}
            submitText={artist ? "Save changes" : "Add artist"}
            deleteAction={artist ? deleteArtist : undefined}
            fields={{
                ...(artist ? { id: { type: "hidden" as const, value: artist.id } } : {}),
                name: {
                    type: "text", label: "Artist name", required: true, maxLength: 255,
                    defaultValue: artist?.name ?? "",
                },
                description: {
                    type: "textarea", label: "Bio", rows: 4,
                    defaultValue: artist?.description ?? "",
                },
                instagramHandle: {
                    type: "text", label: "Instagram handle (optional)",
                    defaultValue: artist?.instagramHandle ?? "", placeholder: "@artist",
                },
                instagramUrl: {
                    type: "url", label: "Instagram link (optional)",
                    defaultValue: artist?.instagramUrl ?? "", placeholder: "https://instagram.com/…",
                },
                featured: {
                    type: "checkbox", label: "Featured artist", defaultChecked: artist?.featured ?? false,
                },
                profilePhoto: {
                    type: "file", label: artist?.profileMediaID ? "Replace photo (optional)" : "Profile photo (optional)",
                    accept: "image/jpeg,image/png,image/webp",
                    help: artist?.profileMediaID ? "JPG, PNG or WebP. Leave empty to keep the current photo." : "JPG, PNG or WebP.",
                },
            }}
        />
    );
}
