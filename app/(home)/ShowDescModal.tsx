import { useEffect, useRef } from "react"
import InfiniteHeader from "../components/InfiniteHeader"

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
        <dialog onClick={onClose} onCancel={(event) => {event.preventDefault(); onClose()}} ref={dialogRef} className='mx-auto my-0 bg-black border-pink border-x  text-white  whitespace-pre-wrap break-normal h-dvh max-h-none'>
                <div className="m-4 p-5 flex flex-row items-center border-b border-gray-700  max-w-[90vw]">
                    
                    {/* <InfiniteHeader buttonText={title} text={title} repeats={1} direction="right" duration={92} /> */}
                    
                    <h2 className="text-3xl font-bold text-center h-max">
                        {title}
                    </h2>
                    <button className="ml-auto cursor-pointer text-6xl h-5 leading-0" onClick={onClose}>×</button>

                </div>
                <div className="flex flex-col items-center">
                    <p className="px-10 pt-4 text-white/30 font-harmond text-2xl tracking-wider">DESCRIPTION </p>
                    <div className="px-15 pb-5 text-xl max-w-xl">
                        {children}
                    </div>
                </div>
                

        </dialog>
    )
}
