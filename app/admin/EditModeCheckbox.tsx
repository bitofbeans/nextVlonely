"use client"
import { Checkbox } from '@base-ui/react/checkbox'
import { useEditMode } from "../components/EditModeProvider"
import { CheckboxIcon } from '../components/Icons'


export function EditModeCheckbox() {
    const {isEditMode, setIsEditMode} = useEditMode()
    return (
        <label className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors ${isEditMode ? "border-pink/40 bg-pink/10" : "border-white/15 bg-white/5 hover:border-white/30"}`}>
            <Checkbox.Root 
                checked={isEditMode} 
                onCheckedChange={(bool) => setIsEditMode(bool)} 
                className="flex size-6 shrink-0 items-center justify-center rounded-md border border-white/40 text-black transition-colors data-checked:border-pink data-checked:bg-pink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink"
                >
                <Checkbox.Indicator>
                    <CheckboxIcon />
                </Checkbox.Indicator>
            </Checkbox.Root>
            <span className="flex flex-1 flex-col gap-1">
                <span className="text-xl font-bold text-white">Edit mode</span>
                
            </span>
            <span className={`text-sm font-bold ${isEditMode ? "text-pink" : "text-white/50"}`}>
                {isEditMode ? "On" : "Off"}
            </span>
        </label>
    )
    }
