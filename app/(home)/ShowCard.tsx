'use client'
import Image from "next/image"
import Link from "next/link";
import { ExternalIcon } from "../components/Icons";
import { artistsTable } from "@/lib/db/schema";
import { Modal } from "./ShowDescModal";
import { useState } from "react";

function ShowDetail({ children }: { children: React.ReactNode}) {
	return (
			<div className="flex gap-6">
				<span className="relative h-8 w-13 xs:w-14 shrink-0">
					<Image className="absolute h-10 w-13 xs:h-14 xs:w-10 -translate-y-1/2 -translate-x-1/2 top-1/2 left-1/2 rotate-270" src="/SVG/verticalStar.svg" alt="" width={37} height={15}></Image>
				</span>
				<div className="text-2xl xs:text-3xl">
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
	imageUrl: string | null;
    ticketUrl: string | null;
	description?: string;
	artists: (typeof artistsTable.$inferInsert| null)[]
};

export default function ShowCard({
	id,
    title,
	date,
	venue,
	description,
	imageUrl,
	ticketUrl,
	artists
}: ShowCardProps) {
	const [isModalOpen, setIsModalOpen] = useState(false)

	const dateObject = new Date(date)
	
	const dateConfig: Intl.DateTimeFormatOptions = {
		month: "long",
		weekday: "long",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
	}

	const localDateTime = new Intl.DateTimeFormat("en-US", dateConfig).format(dateObject)

	imageUrl = imageUrl ? imageUrl : ""
	ticketUrl = ticketUrl ? ticketUrl : ""
	
	const colors = [
		"pink",
		"yellow",
		"orange",
		"purple",
		"blue",
		"teal",
		"green"
	]


	const adjustForPoster = imageUrl != "" ? "lg:grid-cols-[380px_minmax(0,1fr)]" : ""
	const poster = (<Image className="lg:rounded-none rounded-t-4xl overflow-hidden bg-pink" src={imageUrl} width={300} height={300} alt=""/>)
	return (
		<article className="flex flex-col w-[90vw] lg:w-[70vw] my-9">
			<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
				title={title}
				>
				{description}
			</Modal>
			<header className={`relative grid w-full mx-auto max-w-[370px] xs:max-w-none ${adjustForPoster} bg-pink items-center py-1 z-0 lg:-z-10`}>
				<div className="pointer-events-none absolute inset-y-0 -left-px aspect-1/2">
					<Image className="w-full object-contain" src="/SVG/headerCap.svg" alt="" width={25} height={25}/>
				</div>
				<h1 className="text-center text-balance xs:text-left col-start-2 xs:px-5 px-10 text-black font-bold xs:text-4xl py-1 text-3xl -mb-1">
					{title}
				</h1>
				<div className="pointer-events-none absolute inset-y-0 -right-px aspect-1/2 -scale-x-100">
					<Image className="w-full object-contain" src="/SVG/headerCap.svg" alt="" width={25} height={25}/>
				</div>			
			</header>
			<div>
				<div className={`grid grid-cols-1 place-items-center ${adjustForPoster}`}>
					<div className={`-mt-9 lg:-mt-6 lg:pl-10 shrink-0 border-pink bg-pink 
							lg:bg-transparent border-35 lg:border-none ${imageUrl != "" ? "" : "border-none"}`}>
						{imageUrl != "" ? poster : ""}
					</div>
					<div className="flex flex-col w-full h-full">
						<div className="flex flex-col p-9 gap-1 w-full mb-auto">
							<ShowDetail>
								{localDateTime}
							</ShowDetail>
							<ShowDetail>
								{venue}
							</ShowDetail>
							<ShowDetail>
								artists:
								<div className="text-pink">
									{artists.map((artist, index) => {
										const textColor = colors[index % colors.length]
										if (artist) return (
											<div key={index} className="inline-block">
												<Link href={"/artists/" + artist.slug} className={`cursor-pointer whitespace-pre text-${textColor}`}>
													{artist.name}
													<p className="text-white inline-block">{index != artists.length - 1 ? " / " : ""}</p>
												</Link>
												
											</div>
										
										)
										else return <div key={index}></div>
									})}
								</div>
							</ShowDetail>
						</div>
						<div className="flex flex-row justify-center items-center mt-auto">
							<button
								onClick={() => setIsModalOpen(true)}
								className="relative inline-flex h-11 w-36 shrink-0 cursor-pointer
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
							<Link
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
								<span className={`relative flex items-center ${ticketUrl == "" ? "line-through" : ""}`}>
									tickets
									{ticketUrl != "" ? <ExternalIcon /> : ""}

								</span>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</article>
	);
}
