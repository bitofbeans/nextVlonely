"use client";

import CreatableSelect from "react-select/creatable"
import { useId, useState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { Collapsible } from "@base-ui/react";
import imageCompression from "browser-image-compression"
import type { showsTable } from "@/lib/db/schema";
import { artistsTable } from "@/lib/db/schema";
import { useEditMode } from "./EditModeProvider";
import { CaretRightIcon } from "./Icons";
import { postShow, deleteShow } from "@/lib/actions";
import { useArtistOptions } from "./ArtistOptionsProvider";
import { MultiValue } from "react-select";

interface ArtistOption {
    readonly label: string,
    readonly value: string
}

type Show = typeof showsTable.$inferSelect;
type Artist = typeof artistsTable.$inferSelect
/**
 * Converts DB Artist data to
 */
const mapArtistDataToOptions = (artistData: Artist[] | undefined): ArtistOption[] => {
    if (artistData != undefined) {
        return artistData.map((artist) => {
            return {
                label: artist.name,
                value: String(artist.id)
            }
        })
    } else return []
}

type ShowFormProps = {
    defaultShow?: Show;
    posterUrl?: string | null;
    saveAction: ((formData: FormData) => Promise<void>)
    defaultArtists?: Artist[]
};

async function compressAndPostShow(formData: FormData) {
    const poster = formData.get("poster") as File | undefined

    if (poster != undefined && poster.size > 1) {
        const compressed = await imageCompression(poster, {
            maxWidthOrHeight: 1600,
            fileType: "image/webp"
        })
        if (compressed.size > 850000) {
            throw new Error("Image is too large")
        }
        formData.set(
            "poster",
            compressed,
            poster.name.replace(/\.[^.]+$/, "") + ".webp" // changes filetype to webp
        )
    }
    await postShow(formData)
}

const inputClassName = "w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2.5 text-base text-white placeholder:text-white/35 transition-colors hover:border-white/40 focus:border-pink focus:outline-2 focus:outline-pink/30";
const labelClassName = "flex flex-col my-1 gap-1 text-base text-white/80";

export function ShowEdit(props: Omit<ShowFormProps, "saveAction">) {
    const { isEditMode } = useEditMode();
    if (!isEditMode) return null;

    return (
        <Collapsible.Root className="mx-auto my-4 w-full max-w-3xl rounded-xl border border-white/20 bg-gray-900">
            <Collapsible.Trigger
                className="group flex w-full cursor-pointer items-center justify-between gap-4 rounded-xl px-4 py-3 text-xl transition-colors hover:bg-gray-800 data-panel-open:text-pink focus-visible:outline-2 focus-visible:outline-pink"
            >
                {props.defaultShow ? `Edit ${props.defaultShow.title}` : "Add show"}
                <CaretRightIcon aria-hidden="true" className="size-5 shrink-0 transition-transform duration-200 group-data-panel-open:rotate-90 motion-reduce:transition-none" />
            </Collapsible.Trigger>
            <Collapsible.Panel
                keepMounted
                className="h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-starting-style:h-0 data-ending-style:h-0 motion-reduce:transition-none"
            >
                <div className="border-t border-white/10 p-4 sm:p-6">
                    <ShowEditForm key={props.defaultShow?.id ?? "new"} {...props} saveAction={compressAndPostShow} defaultArtists={props.defaultArtists} />
                </div>
            </Collapsible.Panel>
        </Collapsible.Root>
    );
}

export function ShowEditForm({ defaultShow, posterUrl, defaultArtists, saveAction }: ShowFormProps) {
    const id = useId();

    return (
        <form
            action={saveAction}
            className="flex flex-col gap-5"
        >
            {defaultShow && <input type="hidden" name="id" value={defaultShow.id} />}

            <div className="flex flex-col p-3 border border-[#404653] rounded-2xl">
                <label className={labelClassName}>
                    Show title
                    <input name="title" required maxLength={255} defaultValue={defaultShow?.title ?? ""}
                        placeholder="e.g. Vlonely & Friends" className={inputClassName} />
                </label>

                <label className={labelClassName}>
                    Description
                    <textarea name="description" required rows={4} defaultValue={defaultShow?.description ?? ""}
                        placeholder="Tell people about the lineup and what to expect."
                        className={`${inputClassName} min-h-28 resize-y`} />
                </label>

                <label className={labelClassName}>
                    Venue
                    <input name="venue" required maxLength={255} defaultValue={defaultShow?.venue ?? ""}
                        placeholder="Venue name and city" className={inputClassName} />
                </label>
            </div>
            <div className="flex flex-col p-3 border border-[#404653] rounded-2xl">
                <label className={labelClassName}>
                    Artist(s)
                    <ArtistsSelect defaultArtists={defaultArtists}  />
                </label>
            </div>
            <div className="grid gap-5 sm:grid-cols-1">
                <label className={labelClassName}>
                    Date and time
                    <input type="datetime-local" name="date" required defaultValue={defaultShow?.date}
                        aria-describedby={`${id}-date-help`} className={`${inputClassName} min-w-0 scheme-dark`} />
                </label>
            </div>
            <p id={`${id}-date-help`} className="-mt-4 text-sm text-white/50">
                Enter the local time at the venue. NOTE: Shows before today's date are moved to 'archive', shows after are moved to upcoming shows
            </p>

            <label className={labelClassName}>
                Ticket link (optional)
                <input type="url" name="ticketUrl" defaultValue={defaultShow?.ticketUrl ?? ""}
                    placeholder="https://…" className={inputClassName} />
            </label>

            <div className="flex flex-col gap-3 rounded-lg border border-dashed border-white/25 p-4">
                {posterUrl && (
                    <Image src={posterUrl} alt="Current show poster" width={160} height={200}
                        className="h-auto max-h-48 w-auto max-w-full rounded-md object-contain" />
                )}
                <label className={labelClassName}>
                    {defaultShow?.posterMediaID ? "Replace poster (optional)" : "Poster (optional)"}
                    <input type="file" name="poster" accept="image/jpeg,image/png,image/webp"
                        aria-describedby={`${id}-poster-help`}
                        className="w-full min-w-0 rounded-md text-sm text-white/70 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-white hover:file:bg-white/20 focus-visible:outline-2 focus-visible:outline-pink" />
                </label>
                <p id={`${id}-poster-help`} className="text-sm text-white/50">
                    JPG, PNG or WebP.{defaultShow?.posterMediaID ? " Leave empty to keep the current poster." : ""}
                </p>
            </div>

            <div className="flex justify-end gap-5 border-t border-white/10 pt-4">
                <SubmitButton editing={!!defaultShow} />
                {!!defaultShow && <DeleteButton />}
            </div>
        </form>
    );
}

function SubmitButton({ editing }: { editing: boolean }) {
    const { pending } = useFormStatus();

    return (
        <button type="submit" disabled={pending}
            className="w-full cursor-pointer rounded-lg bg-pink px-5 py-2.5 text-lg font-bold text-black 
                transition-colors enabled:hover:bg-pink/80 
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink 
                disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">
            {pending ? "Saving…" : editing ? "Save changes" : "Add show"}
        </button>
    );
}

function DeleteButton() {
    const { pending, action } = useFormStatus();

    return (
        <button type="submit" disabled={pending} formNoValidate formAction={deleteShow}
            className="w-full cursor-pointer rounded-lg bg-pink px-5 py-2.5 text-lg font-bold text-black 
                transition-colors enabled:hover:bg-pink/80 
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink 
                disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">
                    {pending && action === deleteShow ? "Deleting..." : "Delete"}
        </button>
    )
}

function ArtistsSelect({ defaultArtists }: { defaultArtists: ShowFormProps["defaultArtists"]}) {
    const [isLoading, setIsLoading] = useState(false)
    const {artists, createArtistInOptions} = useArtistOptions()
    const [selectedOptions, setSelectedOptions] = useState<MultiValue<ArtistOption> | null>(mapArtistDataToOptions(defaultArtists))

    const artistOptions = mapArtistDataToOptions(artists)

    const handleCreate = async (inputValue: string) => {
        setIsLoading(true)
        await createArtistInOptions(inputValue)
        setIsLoading(false)
    }

    const artistIDs: string[] = selectedOptions ? selectedOptions.map((artist) => artist.value) : []
    return (
        <div>
            <CreatableSelect
                isClearable
                isMulti
                isDisabled={isLoading}
                isLoading={isLoading}
                onChange={(newValue) => setSelectedOptions(newValue)}
                onCreateOption={handleCreate}
                options={artistOptions}
                value={selectedOptions}
                styles={{
                    control: (base, { isFocused }) => ({
                        ...base,
                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                        borderColor: isFocused ? "#f92f83" : "rgba(255,255,255,0.2)",
                        borderRadius: 8,
                        boxShadow: isFocused ? "0 0 0 2px #f92f8340" : "none",
                        padding: 4,
                        "&:hover": {
                        borderColor: isFocused ? "#f92f83" : "rgba(255,255,255,0.4)",
                        },
                    }),

                    input: (base) => ({ ...base, color: "white" }),
                    placeholder: (base) => ({ ...base, color: "#ffffff60" }),

                    menu: (base) => ({
                        ...base,
                        backgroundColor: "#101222",
                        borderRadius: 8,
                    }),

                    option: (base, { isFocused, isSelected }) => ({
                        ...base,
                        backgroundColor: isSelected
                        ? "#f92f83"
                        : isFocused ? "#192130" : "transparent",
                        color: "white",
                        "&:active": { backgroundColor: "#f92f8340" },
                    }),

                    // Selected artist tags
                    multiValue: (base) => ({
                        ...base,
                        backgroundColor: "#f92f8326",
                        borderRadius: 6,
                    }),
                    multiValueLabel: (base) => ({
                        ...base,
                        color: "white",
                    }),
                    multiValueRemove: (base) => ({
                        ...base,
                        color: "#f92f83",
                    }),
                }}
            />
            <input name="artists" type="hidden" defaultValue={artistIDs}/>

        </div>
    )
}
