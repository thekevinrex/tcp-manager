import { ClerkImage } from "@/components/Image";
import { Button } from "@/components/ui/button";
import { Organization } from "@prisma/client";
import { ArrowRight, Building2, MapPin } from "lucide-react";
import Link from "next/link";

type Props = {
	more?: { href: string; label: string };
	title: string;
	organizations: Organization[];
};

export function OrganizationsReel({ more, title, organizations }: Props) {
	return (
		<section className="mb-32 text-center lg:text-left">
			<div className="flex justify-between items-center mb-12">
				<h2 className="text-3xl font-bold flex gap-x-2 items-center">
					<Building2 className="w-8 h-8" />
					{title}
				</h2>

				{more && (
					<div className="flex items-center shrink-0">
						<Button variant={"outline"}>
							<Link href={more.href} className="flex items-center gap-x-2">
								<span>{more.label}</span>
								<ArrowRight />
							</Link>
						</Button>
					</div>
				)}
			</div>

			<div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{organizations.map((organization) => {
					return <ReelItem key={organization.org} {...organization} />;
				})}
			</div>
		</section>
	);
}

const ReelItem = ({
	description,
	image,
	location,
	slug,
	name,
}: Organization) => {
	return (
		<div className="mb-12 lg:mb-0">
			<div className="relative mb-6 h-[200px] overflow-hidden rounded-lg bg-cover bg-no-repeat shadow-lg dark:shadow-black/20 bg-[50%]">
				<Link href={`/organizations/${slug}`}>
					<ClerkImage width={300} height={200} src={image} alt={name} />
					<div className="mask absolute top-0 right-0 bottom-0 left-0 h-full w-full overflow-hidden bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100 bg-[hsla(0,0%,98.4%,0.2)]"></div>
				</Link>
			</div>
			<h5 className="mb-4 text-lg font-bold">{name}</h5>
			<div className="mb-4 flex items-center justify-center text-sm font-medium text-danger dark:text-danger-500 lg:justify-start">
				<MapPin />
				{location}
			</div>
			<p className="text-neutral-500 dark:text-neutral-300 text-ellipsis line-clamp-5">
				{description}
			</p>
		</div>
	);
};
