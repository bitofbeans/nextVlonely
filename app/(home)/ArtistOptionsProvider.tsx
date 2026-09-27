"use client"
import { createContext, useContext, useState } from "react"
import { addArtistToDB } from "./_lib/actions" 
import { artistsTable } from "@/lib/db/schema"

// purpose: drill artist options to all multiselects 
// make context w/createContext, pass state+setter through provider, get context w/useContext

type Artist = typeof artistsTable.$inferSelect

type ArtistsOptionContextType = {
    artists: Artist[],
    createArtistInOptions: (name: string) => void
}

const ArtistOptionContext = createContext<ArtistsOptionContextType | undefined>(undefined)

type ArtistOptionProps = {
    children: React.ReactNode,
    artistOptions: Artist[]
}

export const ArtistOptionProvider = ({ children, artistOptions }: ArtistOptionProps) => {
    const [artists, setArtists] = useState(artistOptions)
    
    const createArtistInOptions = async (name: string) => {
        const newArtist = await addArtistToDB({name})
        setArtists([
            ...artists,
            newArtist
        ])
    }

    return (<ArtistOptionContext value={{artists, createArtistInOptions}}>
        {children}
    </ArtistOptionContext>
    )
}

export function useArtistOptions() {
    const context = useContext(ArtistOptionContext)

    if (context === undefined) {
        throw new Error("No edit mode context outside EditModeProvider")
    }

    return context
}