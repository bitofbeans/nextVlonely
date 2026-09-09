import Image from "next/image"

function ShowDetail({ children }: { children: React.ReactNode}) {
	return (
			<div className="flex items-center gap-6">
				<span className="relative h-5 w-12 shrink-0">
					<Image className="absolute h-12 w-8 -translate-y-1/2 top-1/2 left-1/2 rotate-270" src="/SVG/verticalStar.svg" alt="" width={37} height={15}></Image>
				</span>
				<div className="text-3xl">
					{children}
				</div>
			</div>
	)
}

type ShowCardProps = {
    id: number;
	title: string;
    venue: string;
    date: string;
	imageUrl: string;
    ticketUrl: string | null;
	description?: string;
};

export default function ShowCard({
    title,
	date,
	venue,
	description,
	imageUrl,
	ticketUrl
}: ShowCardProps) {
	const dateObject = new Date(date);

	const localDateTime = dateObject.toLocaleString(undefined, {
		month: "long",
		day: "2-digit",
		hour: "2-digit",
		hour12: true,
	});
	/*
		Structure:
		Header with bg color and black caps for visual shape change
		...
	*/
	ticketUrl = ticketUrl ? ticketUrl : ""
	const poster = (<Image className="rounded-t-[2rem] overflow-hidden bg-pink" src={imageUrl} width={300} height={300} alt=""/>)
	return (
		<article className="flex flex-col w-[90vw] my-9">
			<header className="relative grid w-full mx-auto max-w-[370px] xs:max-w-none lg:grid-cols-[380px_minmax(0,1fr)] bg-pink items-center z-0 lg:-z-10">
				<div className="pointer-events-none absolute inset-y-0 -left-px aspect-1/2">
					<Image className="w-full object-contain" src="/SVG/headerCap.svg" alt="" width={25} height={25}/>
				</div>
				<h1 className="text-center text-balance sm:text-left col-start-2 xs:px-5 px-10 text-black font-bold xs:text-4xl text-3xl">
					{title}
				</h1>
				<div className="pointer-events-none absolute inset-y-0 -right-px aspect-1/2 -scale-x-100">
					<Image className="w-full object-contain" src="/SVG/headerCap.svg" alt="" width={25} height={25}/>
				</div>			
			</header>
			<div>
				<div className="grid grid-cols-1 place-items-center lg:grid-cols-[380px_minmax(0,1fr)]">
					<div className="-mt-9 lg:-mt-6 lg:px-10 shrink-0 border-pink bg-pink lg:bg-transparent border-35 lg:border-none">
						{poster}
					</div>
					<div className="flex flex-col w-full h-full">
						<div className="flex flex-col py-5 gap-3 w-full my-auto">
							<ShowDetail>
								{localDateTime}
							</ShowDetail>
							<ShowDetail>
								{venue}
							</ShowDetail>
							<ShowDetail>
								<p className="text-pink">
									{"nardi, bandtana, patex, vlonely, stylxst, keily rude, glozaee"}
								</p>
							</ShowDetail>
						</div>
						<div className="flex flex-row justify-center items-center mt-auto">
							<button
								className="relative inline-flex h-11 w-36 shrink-0
											items-center justify-center text-2xl text-white
											focus-visible:outline-2 focus-visible:outline-offset-4"
								>
								<img
									src="/SVG/button.svg"
									alt=""
									className="pointer-events-none absolute inset-0 h-full w-full"
								/>
								<span className="relative">info</span>
							</button>
							<Image className="mx-5" src={"SVG/circle.svg"} alt="" width={43} height={43}/>
							<a
								href={ticketUrl}
								className="relative inline-flex h-11 w-36 shrink-0
											items-center justify-center text-2xl text-white
											focus-visible:outline-2 focus-visible:outline-offset-4"
								>
								<img
									src="/SVG/button.svg"
									alt=""
									className="pointer-events-none absolute inset-0 h-full w-full"
								/>
								<span className="relative">tickets</span>
							</a>
						</div>
					</div>
				</div>
			</div>
		</article>
	);
}
