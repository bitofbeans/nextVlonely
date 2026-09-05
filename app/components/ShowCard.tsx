import Image from "next/image"

type ShowCardProps = {
    id: number;
	title: string;
    venue: string;
    date: string;
	imageUrl?: string;
    ticketUrl?: string;
	description?: string;
};

export default function ShowCard({
    title,
	imageUrl,
	description,
}: ShowCardProps) {
	return (
		<article className="overflow-hidden rounded-lg border bg-white shadow-sm">
			{imageUrl && (
				<Image className="h-48 w-full object-cover" src={imageUrl} alt={title} />
			)}
			<div className="p-4">
				<h2 className="text-lg font-semibold">{title}</h2>
				{description && <p className="mt-2 text-sm text-gray-600">{description}</p>}
			</div>
		</article>
	);
}
