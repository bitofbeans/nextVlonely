"use client"

import { createContext, type Dispatch, SetStateAction, useContext, useState } from "react"


type EditModeContextType = {
    isEditMode: boolean,
    setIsEditMode: Dispatch<SetStateAction<boolean>> // type for setting state
}

const EditModeContext = createContext< EditModeContextType | undefined >(undefined)

type EditModeProps = { 
    children: React.ReactNode, 
    initialMode?: boolean
}

export const EditModeProvider = ({ children, initialMode = false } : EditModeProps) => {
    const [isEditMode, setIsEditMode] = useState(initialMode)

    return (
        <EditModeContext value={{ isEditMode, setIsEditMode }} >
            {children}
        </EditModeContext>
    )
}

export function useEditMode() {
    const context = useContext(EditModeContext)

    if (context === undefined) {
        throw new Error("No edit mode context outside EditModeProvider")
    }

    return context
}