import { ClerkImage } from "@/components/Image";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Organization } from "@prisma/client";
import { Bike, MapPin, MessageCircleReply, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { DomicilioDo } from "./domicilio/domicilio";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Share } from "@/components/share";

export function OrganizationDetails({
	org,
	reverse = false,
	productId,
}: {
	org: Organization;
	reverse?: boolean;
	productId?: number;
}) {
	const _ = useTranslations("home");

	const link = `https://wa.me/${org.phone}&text=${_("share-text")}`;
	const share = `${
		process.env.HOST_URL || "http://localhost:3000"
	}/organizations/${org.slug}`;

	return (
		<section
			className={cn("pt-8 pb-5 flex flex-col max-md:items-center gap-4", {
				"md:flex-row-reverse": reverse,
				"md:flex-row": !reverse,
			})}
		>
			<div className="relative w-[300px] flex mb-6 h-[300px] overflow-hidden rounded-lg bg-cover bg-no-repeat shadow-lg dark:shadow-black/20 bg-[50%] flex-col shrink-0">
				<ClerkImage src={org.image} alt={org.name} />
				<div className="mask absolute top-0 right-0 bottom-0 left-0 h-full w-full overflow-hidden bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100 bg-[hsla(0,0%,98.4%,0.2)]"></div>
			</div>

			<div className="w-full flex flex-col px-2">
				<h1 className="text-xl md:text-3xl lg:text-5xl font-semibold tracking-wide mb-3">
					{org.name}
				</h1>
				<p className="max-w-prose tracking-wide text-muted-foreground mb-3">
					{org.description}
				</p>

				<div>
					<Share link={share} />
				</div>

				<Separator className="my-3" />

				<div className="flex flex-col space-y-3">
					<span className="txt-sm font-semibold">{_("contact_details")}</span>

					<div className="flex flex-col gap-y-2">
						<div className="flex items-center gap-x-3">
							<Phone />
							<span className="text-lg">{org.phone}</span>
						</div>

						<div className="flex gap-x-3">
							<a
								href={link}
								target="_blank"
								className="border rounded-2xl bg-green-500 text-white items-center text-sm flex gap-x-1 px-2 py-1 hover:bg-green-700 cursor-pointer"
							>
								<svg
									width="20"
									height="20"
									viewBox="0 0 24 24"
									strokeWidth="2"
									stroke="currentColor"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path stroke="none" d="M0 0h24v24H0z" fill="none" />
									<path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" />
									<path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1" />
								</svg>
								{_("whatsapp")}
							</a>
						</div>
					</div>

					<div className="flex items-center gap-x-3">
						<MapPin />
						<span className="text-lg">{org.location}</span>
					</div>
				</div>

				<Separator className="my-3" />

				<div className="flex flex-col space-y-5">
					<span className="txt-sm font-semibold">{_("domicilio")}</span>
					{org.domicilio ? (
						<>
							<div className="flex items-center gap-x-3">
								<Bike />
								{_("domicilio_yes")}
							</div>

							{org.domicilio_details && (
								<p className="text-xl font-semibold">{org.domicilio_details}</p>
							)}

							<div>
								<Suspense fallback={<Skeleton className="w-[150px] h-10" />}>
									<DomicilioDo orgId={org.org} productId={productId} />
								</Suspense>
							</div>
						</>
					) : (
						<span className="text-lg font-semibold">{_("domicilio_no")}</span>
					)}
				</div>
			</div>
		</section>
	);
}
