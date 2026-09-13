"use client";

import { useId } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { Collapsible } from "@base-ui/react";
import type { showsTable } from "@/lib/db/schema";
import { useEditMode } from "../components/EditModeProvider";
import { CaretRightIcon } from "../components/Icons";
import { postShow, deleteShow } from "./showActions";

type Show = typeof showsTable.$inferSelect;

type ShowFormProps = {
    defaultShow?: Show;
    posterUrl?: string | null;
    saveAction: ((formData: FormData) => Promise<void>)
};

const inputClassName = "w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2.5 text-base text-white placeholder:text-white/35 transition-colors hover:border-white/40 focus:border-pink focus:outline-2 focus:outline-pink/30";
const labelClassName = "flex flex-col gap-2 text-base text-white/80";

export function ShowEdit(props: Omit<ShowFormProps, "saveAction">) {
    const { isEditMode } = useEditMode();
    if (!isEditMode) return null;

    return (
        <Collapsible.Root className="mx-auto w-full max-w-3xl rounded-xl border border-white/20 bg-gray-900">
            <Collapsible.Trigger
                className="group flex w-full cursor-pointer items-center justify-between gap-4 rounded-xl px-4 py-3 text-xl transition-colors hover:bg-gray-800 data-panel-open:text-pink focus-visible:outline-2 focus-visible:outline-pink"
            >
                {props.defaultShow ? `Edit ${props.defaultShow.title}` : "Add show"}
                <CaretRightIcon aria-hidden="true" className="size-5 shrink-0 transition-transform duration-200 group-data-panel-open:rotate-90 motion-reduce:transition-none" />
            </Collapsible.Trigger>
            <Collapsible.Panel
                keepMounted
                className="h-[var(--collapsible-panel-height)] overflow-hidden transition-[height] duration-200 ease-out data-starting-style:h-0 data-ending-style:h-0 motion-reduce:transition-none"
            >
                <div className="border-t border-white/10 p-4 sm:p-6">
                    <ShowForm key={props.defaultShow?.id ?? "new"} {...props} saveAction={postShow} />
                </div>
            </Collapsible.Panel>
        </Collapsible.Root>
    );
}

export function ShowForm({ defaultShow, posterUrl, saveAction }: ShowFormProps) {
    const id = useId();

    return (
        <form
            action={saveAction}
            className="flex flex-col gap-5"
        >
            {defaultShow && <input type="hidden" name="id" value={defaultShow.id} />}

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

            <div className="grid gap-5 sm:grid-cols-2">
                <label className={labelClassName}>
                    Date and time
                    <input type="datetime-local" name="date" required defaultValue={defaultShow?.date}
                        aria-describedby={`${id}-date-help`} className={`${inputClassName} min-w-0 scheme-dark`} />
                </label>
                {/* <label className={labelClassName}>

                    Time zone
                    <select name="timezone" required
                        defaultValue={defaultShow?.timezone ?? "America/Chicago"}
                        className={`${inputClassName} scheme-dark`} aria-describedby={`${id}-date-help`}>
                        <option value="America/New_York">Eastern — New York</option>
                        <option value="America/Chicago">Central — Chicago</option>
                        <option value="America/Denver">Mountain — Denver</option>
                        <option value="America/Los_Angeles">Pacific — Los Angeles</option>
                        <option value="America/Phoenix">Arizona — Phoenix</option>
                        <option value="Pacific/Honolulu">Hawaii — Honolulu</option>
                    </select>
                </label> */}
            </div>
            <p id={`${id}-date-help`} className="-mt-3 text-sm text-white/50">
                Enter the local time at the venue.
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