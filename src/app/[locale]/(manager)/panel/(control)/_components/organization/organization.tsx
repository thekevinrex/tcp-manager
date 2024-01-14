"use client";

import { useOrganization } from "@clerk/nextjs";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

export function Organization() {
	const { organization } = useOrganization();
	const _ = useTranslations("organization");
	if (!organization) {
		return;
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>{_("organization")}</CardTitle>
				<CardDescription>{_("organization_card_des")}</CardDescription>
			</CardHeader>

			<CardContent>
				<div className="flex flex-col space-y-3 mb-5">
					<div className="flex justify-between items-center">
						<span className="text-sm text-muted-foreground text-pretty text-ellipsis">
							{_("org_name")}
						</span>
						<span className="font-semibold">{organization.name}</span>
					</div>
				</div>

				<Button variant={"ghost"} asChild>
					<Link href="/panel/organization">{_("settings")}</Link>
				</Button>
			</CardContent>
		</Card>
	);
}

export default Organization;
