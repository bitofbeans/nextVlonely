type ModalProps = {
    children: React.ReactNode
    isOpen: boolean
}


export function Modal({children, isOpen}: ModalProps) {

    return(
        <dialog className='absolute'>
            {children}
        </dialog>
    )
}