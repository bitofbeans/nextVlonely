
type InfiniteHeaderProps = {
    text: string,
    direction: "left" | "right",
    buttonText?: string,
}

export default function InfiniteHeader({ text, direction }: InfiniteHeaderProps) {
    const fullString = (text + " ").repeat(10)

    const animationClass = direction === 'left' ? 'animate-scroll-left' : 'animate-scroll-right'
	return (
        <div className="max-w-full overflow-hidden">
            {[...Array(4)].map((_, i) => {
                return (
                    <div className={`flex ${animationClass} w-max`}  key={i}>
                         <span className="text-center text-2xl leading-none h-1/4 font-harmond font-bold flex whitespace-nowrap" key={i} >{fullString}</span>
                         <span className="text-center text-2xl leading-none h-1/4 font-harmond font-bold flex whitespace-nowrap" key={i+1} >{fullString}</span>
                    </div>
            )})}
        </div>
    );
}
