"use client";

import { Collapsible } from "@base-ui/react";
import { useId, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { useEditMode } from "./EditModeProvider";
import { CaretRightIcon } from "../Icons";

type FormAction = (formData: FormData) => Promise<void>;

type EditField =
    | { type: "hidden"; value: string | number }
    | { type: "custom"; label: string; content: ReactNode }
    | { type: "checkbox"; label: string; defaultChecked?: boolean }
    | {
        type: "text" | "url" | "datetime-local" | "textarea" | "file";
        label: string;
        defaultValue?: string;
        required?: boolean;
        maxLength?: number;
        placeholder?: string;
        rows?: number;
        accept?: string;
        multiple?: boolean;
        help?: string;
    };

type EditFormProps = {
    title: string;
    fields: Record<string, EditField>;
    action: FormAction;
    submitText: string;
    deleteAction?: FormAction;
};

const inputClassName = "w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2.5 text-base text-white placeholder:text-white/35 transition-colors hover:border-white/40 focus:border-pink focus:outline-2 focus:outline-pink/30";
const fileClassName = "w-full min-w-0 rounded-md text-sm text-white/70 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-white hover:file:bg-white/20 focus-visible:outline-2 focus-visible:outline-pink";
const buttonClassName = "w-full cursor-pointer rounded-lg bg-pink px-5 py-2.5 text-lg font-bold text-black transition-colors enabled:hover:bg-pink/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto";

function FormButtons({ submitText, deleteAction }: { submitText: string; deleteAction?: FormAction }) {
    const { pending, action } = useFormStatus();

    return (
        <div className="flex justify-end gap-5 border-t border-white/10 pt-4">
            <button type="submit" disabled={pending} className={buttonClassName}>
                {pending && action !== deleteAction ? "Saving…" : submitText}
            </button>
            {deleteAction && (
                <button type="submit" disabled={pending} formNoValidate formAction={deleteAction} className={buttonClassName}>
                    {pending && action === deleteAction ? "Deleting..." : "Delete"}
                </button>
            )}
        </div>
    );
}

export default function EditForm({ title, fields, action, submitText, deleteAction }: EditFormProps) {
    const { isEditMode } = useEditMode();
    const formId = useId();
    if (!isEditMode) return null;

    return (
        <Collapsible.Root className="mx-auto my-4 w-full max-w-3xl rounded-xl border border-white/20 bg-gray-900">
            <Collapsible.Trigger className="group flex w-full cursor-pointer items-center justify-between gap-4 rounded-xl px-4 py-3 text-xl transition-colors hover:bg-gray-800 data-panel-open:text-pink focus-visible:outline-2 focus-visible:outline-pink">
                {title}
                <CaretRightIcon aria-hidden="true" className="size-5 shrink-0 transition-transform duration-200 group-data-panel-open:rotate-90 motion-reduce:transition-none" />
            </Collapsible.Trigger>
            <Collapsible.Panel keepMounted className="h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-starting-style:h-0 data-ending-style:h-0 motion-reduce:transition-none">
                <div className="border-t border-white/10 p-4 sm:p-6">
                    <form action={action} className="flex flex-col gap-5">
                        {Object.entries(fields).map(([name, field]) => {
                            if (field.type === "hidden") {
                                return <input key={name} type="hidden" name={name} value={field.value} />;
                            }
                            if (field.type === "custom") {
                                return <label key={name} className="flex flex-col my-1 gap-1 text-base text-white/80">{field.label}{field.content}</label>;
                            }
                            if (field.type === "checkbox") {
                                return (
                                    <label key={name} className="flex items-center gap-3 text-base text-white/80">
                                        <input type="checkbox" name={name} value="true" defaultChecked={field.defaultChecked} className="size-4 accent-pink" />
                                        {field.label}
                                    </label>
                                );
                            }

                            const helpId = field.help ? `${formId}-${name}-help` : undefined;
                            const common = { name, required: field.required, "aria-describedby": helpId };
                            return (
                                <div key={name} className={field.type === "file" ? "flex flex-col gap-3 rounded-lg border border-dashed border-white/25 p-4" : undefined}>
                                    <label className="flex flex-col my-1 gap-1 text-base text-white/80">
                                        {field.label}
                                        {field.type === "textarea" ? (
                                            <textarea {...common} defaultValue={field.defaultValue} maxLength={field.maxLength} placeholder={field.placeholder} rows={field.rows} className={`${inputClassName} min-h-28 resize-y`} />
                                        ) : (
                                            <input {...common} type={field.type} defaultValue={field.type === "file" ? undefined : field.defaultValue} maxLength={field.maxLength} placeholder={field.placeholder} accept={field.accept} multiple={field.multiple} className={field.type === "file" ? fileClassName : `${inputClassName} ${field.type === "datetime-local" ? "min-w-0 scheme-dark" : ""}`} />
                                        )}
                                    </label>
                                    {field.help && <p id={helpId} className="text-sm text-white/50">{field.help}</p>}
                                </div>
                            );
                        })}
                        <FormButtons submitText={submitText} deleteAction={deleteAction} />
                    </form>
                </div>
            </Collapsible.Panel>
        </Collapsible.Root>
    );
}
