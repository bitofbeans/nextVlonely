
type InfiniteHeaderProps = {
    text: string,
    repeats: number,
    direction: "left" | "right",
    duration: number,
    buttonText?: string,
    buttonLink?: string,
    buttonColor?:
        | "text-pink"
        | "text-yellow"
        | "text-orange"
        | "text-purple"
        | "text-blue"
        | "text-teal"
        | "text-green" 
        | "text-white",
}

export default function InfiniteHeader({ text, repeats, direction, duration, buttonText, buttonLink, buttonColor }: InfiniteHeaderProps) {
    const fullString = (text + " ").repeat(15)

    const animationClass = direction === 'left' ? 'animate-scroll-left' : 'animate-scroll-right'
	return (
		<div className="relative w-full overflow-hidden py-1.5">
            {[...Array(repeats)].map((_, i) => {
                return (
                    <div className={`flex ${animationClass} w-max`} style={{ animationDuration: duration + "s" }}  key={i}>
                         <span className="flex whitespace-pre text-center font-harmond text-[clamp(2rem,7vw,3rem)] font-bold leading-[0.8]" key={i} >{fullString}</span>
                         <span className="flex whitespace-pre text-center font-harmond text-[clamp(2rem,7vw,3rem)] font-bold leading-[0.8]" key={i+1} >{fullString}</span>
                    </div>
            )})}
            <div className="absolute flex w-full h-full z-1 top-0 left-0 justify-center items-center">
                {buttonText && (
                    <div className="flex justify-center items-center w-max h-full bg-black side-drop-shadows "> 
                        <a href={buttonLink} className={`text-3xl underline decoration-1 underline-offset-2 sm:text-5xl px-5 rounded-2xl ${buttonColor}`}>
                            {buttonText}
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
