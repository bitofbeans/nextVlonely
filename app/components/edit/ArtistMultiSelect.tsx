import CreatableSelect from "react-select/creatable"
import { useState } from "react";
import { artistsTable } from "@/lib/db/schema"
import { MultiValue } from "react-select";
import { useArtistOptions } from "./ArtistOptionsProvider";

interface ArtistOption {
    readonly label: string,
    readonly value: string
}

type Artist = typeof artistsTable.$inferSelect

/**
 * Converts DB Artist data to Options type for multi select 
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

export default function ArtistMultiSelect({ defaultArtists }: { defaultArtists: Artist[] | undefined }) {
    const [isLoading, setIsLoading] = useState(false)
    const [createError, setCreateError] = useState("")
    const {artists, createArtistInOptions} = useArtistOptions()
    const [selectedOptions, setSelectedOptions] = useState<MultiValue<ArtistOption> | null>(mapArtistDataToOptions(defaultArtists))

    const artistOptions = mapArtistDataToOptions(artists)

    const handleCreate = async (inputValue: string) => {
        setIsLoading(true)
        setCreateError("")
        try {
            const artist = await createArtistInOptions(inputValue)
            setSelectedOptions((current) => [...(current ?? []), { label: artist.name, value: String(artist.id) }])
        } catch {
            setCreateError("Could not create the artist. Please try again.")
        } finally {
            setIsLoading(false)
        }
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
            {createError && <p role="alert" className="mt-2 text-sm text-pink">{createError}</p>}
            <input name="artists" type="hidden" value={artistIDs.join(",")}/>

        </div>
    )
}
