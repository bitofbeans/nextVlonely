import Image from "next/image";

export default function Home() {
    return (
        <div>
            <Image 
                className="h-auto w-[min(90vw,1100px)] my-15"
                src="/vlonelyDark.png" 
                alt="vlonely" 
                width={1920} 
                height={1080}
            />
            <div className="flex border p-5 justify-center">
                <h1 className="font-bold text-3xl">upcoming shows</h1>
                <div>
                    
                </div>
            </div>
        </div>
    );
}
