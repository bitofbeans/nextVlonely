export default function Footer() {
    return (
        <div className='m-5 grid grid-cols-5 w-full text-3xl place-items-center '>
            <div className="col-start-3 min-w-max">
                website by <a className="pl-1 underline decoration-1 underline-offset-2 text-blue-400" href="https://bitbeans.me">bitbeans</a>
            </div>
            <div className='w-full flex justify-end col-start-5'>
                <a className="text-xl text-white/25 p-2" href="/admin">log-in</a>
            </div>
        </div>
    )
}