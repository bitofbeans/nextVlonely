import { useEffect, useRef } from "react"


type ModalProps = {
    title: string,
    children: React.ReactNode,
    isOpen: boolean,
    onClose: () => void
}


export function Modal({title, children, isOpen, onClose}: ModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null)
    useEffect(() => {
        const dialog = dialogRef.current
        if (dialog == null) return

        if (isOpen) dialog.showModal()
        else dialog.close()
    }, [isOpen])

    
    return (
        <dialog onClick={onClose} onCancel={(event) => {event.preventDefault(); onClose()}} ref={dialogRef} className='w-full max-w-2xl mx-auto my-0 bg-black border-white/15 sm:mt-14 border text-white rounded-2xl whitespace-pre-wrap break-normal h-dvh max-h-none'>
                <h2 id="show-description" className="bg-white px-6 py-2 font-harmond text-xl font-bold text-black sm:text-2xl">
                    DESCRIPTION
                </h2>
                <div className="m-4 p-5 flex flex-row items-center border-b border-gray-700  max-w-[90vw]">
                    <h2 className="text-3xl font-bold text-center h-max">
                        {title}
                    </h2>
                    <button className="ml-auto cursor-pointer text-6xl h-5 leading-0" onClick={onClose}>×</button>
                </div>
                <section aria-labelledby="show-description" className="mt-10 w-full max-w-2xl overflow-hidden ">

                    <div className="p-6">
                        {children}
                    </div>
                </section>
                

        </dialog>
    )
}
