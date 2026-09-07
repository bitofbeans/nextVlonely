import Image from "next/image"

type ShowCardProps = {
    id: number;
	title: string;
    venue: string;
    date: string;
	imageUrl: string | null;
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
	return (
		<article className="flex rounded-lg border-white bg-black shadow-sm">
			{imageUrl && (
				<Image className="h-120 w-full object-cover rounded-3xl" src={imageUrl} alt={title} width={100} height={100} />
			)}
			<div className="p-4 flex flex-col gap-3 ">
				<div className="bg-gray-800 p-1 text-center rounded-md">
					<h2 className="text-lg font-bold">{title}</h2>
				</div>
				<div className="bg-gray-800 p-1 text-center rounded-md">
					<h3 className="text-lg font-semibold">{localDateTime}</h3>
					<h3 className="text-lg font-semibold">{venue}</h3>
					
				</div>
				<div className="bg-gray-900 flex flex-1 rounded-md max-h-100 overflow-auto">
					{description && <p className="mt-2 text-sm text-gray-200">{`@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW
syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW
syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW

`}</p>}
				</div>
				{ticketUrl && (
					<div className="bg-blue-800 p-1 text-center rounded-md cursor-pointer">
						<a href={ticketUrl} className="text-lg font-semibold">Get Tickets</a>
					</div>
				)}
				
			</div>
		</article>
	);
}
