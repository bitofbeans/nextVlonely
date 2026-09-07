
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
        <div className="max-w-full overflow-hidden">
            {[...Array(4)].map((_, i) => {
                return (
                    <div className={`flex ${animationClass} w-max max-h-[34px]`} style={{ animationDuration: duration + "s" }}  key={i}>
                         <span className="text-center text-5xl leading-none font-harmond font-bold flex whitespace-pre" key={i} >{fullString}</span>
                         <span className="text-center text-5xl leading-none font-harmond font-bold flex whitespace-pre" key={i+1} >{fullString}</span>
                    </div>
            )})}
        </div>
    );
}
