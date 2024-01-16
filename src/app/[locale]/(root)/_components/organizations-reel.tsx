import { Organization } from "@prisma/client";
import { OrganizationReelItem } from "@/components/page/organization-reel-item";
import { Reel } from "@/components/reel";
import { Building2 } from "lucide-react";

type Props = {
	more?: { href: string; label: string };
	title: string;
	organizations: Organization[];
};

export function OrganizationsReel({ more, title, organizations }: Props) {
	return (
		<Reel
			title={
				<>
					<Building2 className="w-8 h-8" /> {title}
				</>
			}
			more={more}
		>
			<div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{organizations.map((organization) => {
					return (
						<OrganizationReelItem key={organization.org} {...organization} />
					);
				})}
			</div>
		</Reel>
	);
}
