"use client";

import { compressImage, uploadMediaToCloudflare } from "@/lib/helpers";
import type { showsTable } from "@/lib/db/schema";
import { artistsTable } from "@/lib/db/schema";
import { postShow, deleteShow } from "@/lib/actions";
import EditForm from "./EditForm";
import ArtistMultiSelect from "./ArtistMultiSelect";

interface ArtistOption {
    readonly label: string,
    readonly value: string
}
type Show = typeof showsTable.$inferSelect;
type Artist = typeof artistsTable.$inferSelect

type ShowFormProps = {
    defaultShow?: Show;
    defaultArtists?: Artist[]
};


const submitShowEditForm = async (formData: FormData) => {
    // upload submitted file directly to cloudflare
    const poster = formData.get("poster") as File | null;

    if (poster instanceof File && poster.size > 0) {
        const uuid = await uploadMediaToCloudflare(await compressImage(poster));
        formData.append("poster-uuid", uuid);
        formData.delete("poster");
    }
    await postShow(formData);
};

export function ShowEditCollapsible({ defaultShow, defaultArtists }: ShowFormProps) {
    return (
        <EditForm
            title={defaultShow ? `Edit ${defaultShow.title}` : "Add show"}
            action={submitShowEditForm}
            submitText={defaultShow ? "Save changes" : "Add show"}
            deleteAction={defaultShow ? deleteShow : undefined}
            fields={{
                ...(defaultShow ? { id: { type: "hidden" as const, value: defaultShow.id } } : {}),
                title: {
                    type: "text", label: "Show title", required: true, maxLength: 255,
                    defaultValue: defaultShow?.title ?? "", placeholder: "e.g. Vlonely & Friends",
                },
                description: {
                    type: "textarea", label: "Description", required: true, rows: 4,
                    defaultValue: defaultShow?.description ?? "",
                    placeholder: "Tell people about the lineup and what to expect.",
                },
                venue: {
                    type: "text", label: "Venue", required: true, maxLength: 255,
                    defaultValue: defaultShow?.venue ?? "", placeholder: "Venue name and city",
                },
                artists: {
                    type: "custom", label: "Artist(s)",
                    content: <ArtistMultiSelect defaultArtists={defaultArtists} />,
                },
                date: {
                    type: "datetime-local", label: "Date and time", required: true,
                    defaultValue: defaultShow?.date,
                    help: "Enter the local time at the venue. NOTE: Shows before today's date are moved to 'archive', shows after are moved to upcoming shows",
                },
                ticketUrl: {
                    type: "url", label: "Ticket link (optional)",
                    defaultValue: defaultShow?.ticketUrl ?? "", placeholder: "https://…",
                },
                poster: {
                    type: "file", label: defaultShow?.posterMediaID ? "Replace poster (optional)" : "Poster (optional)",
                    accept: "image/jpeg,image/png,image/webp",
                    help: `JPG, PNG or WebP.${defaultShow?.posterMediaID ? " Leave empty to keep the current poster." : ""}`,
                },
            }}
        />
    );
}
