import Image from "next/image"

export default function About() {
    return (
        <div className="flex flex-row p-9 gap-3 my-15">
            <div className="flex flex-col py-2 px-10 items-center gap-1" >
                <a className="p-2" href="https://www.instagram.com/vlonelyandfriends/">
                    <Image src="/SVG/instagramLogo.svg" alt="instagram" width={50} height={50} />
                </a>
                <a className="p-2" href="https://posh.vip/g/vlonelyfriends">
                    <Image className="aspect-square" src="/SVG/poshLogo.svg" alt="posh" width={55} height={55} />
                </a>
            </div>
            <div className="flex flex-col text-[2.8rem]  max-w-220 gap-12 leading-tight">
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
        </div>
    )
}