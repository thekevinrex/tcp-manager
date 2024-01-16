import { ClerkImage } from "@/components/Image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Organization } from "@prisma/client";
import { Bike, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";

export function OrganizationDetails({
	org,
	reverse = false,
}: {
	org: Organization;
	reverse?: boolean;
}) {
	const _ = useTranslations("home");

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
				<h2 className="text-xl md:text-3xl lg:text-5xl font-semibold tracking-wide">
					{org.name}
				</h2>
				<p className="max-w-prose tracking-wide text-muted-foreground mb-3">
					{org.description}
				</p>

				<Separator className="my-3" />

				<div className="flex flex-col space-y-3">
					<span className="txt-sm font-semibold">{_("contact_details")}</span>

					<div className="flex items-center gap-x-3">
						<Phone />
						<span className="text-lg">{org.phone}</span>
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
								<Button variant={"secondary"}>{_("domicilio_do")}</Button>
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
