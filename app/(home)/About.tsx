import Image from "next/image"

export default function About() {
    return (
        <section className="my-12 flex w-full max-w-280 flex-col gap-6 p-9 sm:my-15 sm:flex-row sm:gap-3">
            <div className="flex flex-row items-center justify-center gap-3 sm:flex-col sm:gap-1 sm:px-10 sm:py-2" >
                <a className="flex size-11 items-center justify-center" href="https://www.instagram.com/vlonelyandfriends/">
                    <Image src="/SVG/instagramLogo.svg" alt="instagram" width={50} height={50} />
                </a>
                <a className="flex size-11 items-center justify-center" href="https://posh.vip/g/vlonelyfriends">
                    <Image className="aspect-square" src="/SVG/poshLogo.svg" alt="posh" width={55} height={55} />
                </a>
            </div>
            <div className="flex min-w-0 flex-col gap-6 text-[clamp(1.75rem,8vw,2.8rem)] leading-tight sm:gap-12">
                <p>
                    we throw shows with our friends
                </p>
                <p>
                    events range from community networking to shows featuring some of your favorite underground artists
                </p>
                <p>
                    <strong>join vlonely&friends today!</strong>
                </p>
            </div>
        </section>
    )
}
