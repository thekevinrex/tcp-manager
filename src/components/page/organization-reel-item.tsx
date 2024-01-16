import { Organization } from "@prisma/client";
import { ClerkImage } from "@/components/Image";
import { MapPin } from "lucide-react";
import Link from "next/link";

export const OrganizationReelItem = ({
	description,
	image,
	location,
	slug,
	name,
}: Organization) => {
	return (
		<div className="mb-12 lg:mb-0  space-y-3 flex flex-col items-center">
			<div className="relative mb-6 w-full max-w-[300px] h-[200px] overflow-hidden rounded-lg bg-cover bg-no-repeat shadow-lg dark:shadow-black/20 bg-[50%] items-center">
				<ClerkImage src={image} alt={name} />
				<Link href={`/organizations/${slug}`}>
					<div className="mask absolute top-0 right-0 bottom-0 left-0 h-full w-full overflow-hidden bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100 bg-[hsla(0,0%,98.4%,0.2)]"></div>
				</Link>
			</div>
			<h5 className="mb-4 text-lg font-bold">{name}</h5>
			<div className="mb-4 flex items-center justify-center text-sm font-medium text-danger dark:text-danger-500 lg:justify-start">
				<MapPin />
				{location}
			</div>
			<p className=" text-center lg:text-start text-neutral-500 dark:text-neutral-300 text-ellipsis line-clamp-5">
				{description}
			</p>
		</div>
	);
};
