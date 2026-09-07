
type InfiniteHeaderProps = {
    text: string,
    direction: "left" | "right",
    duration: number,
    buttonText?: string,
}

export default function InfiniteHeader({ text, direction, duration }: InfiniteHeaderProps) {
    const fullString = (text + " ").repeat(15)

    const animationClass = direction === 'left' ? 'animate-scroll-left' : 'animate-scroll-right'
	return (
		<div className="w-full overflow-hidden">
            {[...Array(4)].map((_, i) => {
                return (
                    <div className={`flex ${animationClass} w-max`} style={{ animationDuration: duration + "s" }}  key={i}>
                         <span className="flex whitespace-pre text-center font-harmond text-[clamp(2rem,7vw,3rem)] font-bold leading-[0.8]" key={i} >{fullString}</span>
                         <span className="flex whitespace-pre text-center font-harmond text-[clamp(2rem,7vw,3rem)] font-bold leading-[0.8]" key={i+1} >{fullString}</span>
                    </div>
            )})}
        </div>
    );
}
