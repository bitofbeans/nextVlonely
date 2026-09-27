import { Dispatch, SetStateAction, useEffect, useRef } from "react"


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
        <dialog onClick={onClose} onCancel={(event) => {event.preventDefault(); onClose()}} ref={dialogRef} className='m-auto bg-black border-pink border  text-white  rounded-2xl whitespace-pre-wrap break-normal'>
            <div className="p-5 flex flex-row items-center border-b border-gray-700 rounded-2xl">
                <h2 className="text-3xl font-bold text-center h-max">
                    {title}
                </h2>
                <button className="ml-auto cursor-pointer text-6xl h-5 leading-0" onClick={onClose}>×</button>

            </div>
            <p className="px-10 pt-4 text-white/50 font-harmond text-3xl">DESCRIPTION </p>
            <div className="px-15 pb-5">
                {children}
            </div>
            <div className="">
            </div>
        </dialog>
    )
}