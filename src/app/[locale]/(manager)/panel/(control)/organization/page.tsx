import { unstable_setRequestLocale } from "next-intl/server";
import { Settings, Truck, Users, Wallet } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function OrganizationPage({
	params: { locale },
}: {
	params: { locale: string };
}) {
	unstable_setRequestLocale(locale);
	const _ = useTranslations("organization");

	const LINKS = [
		{
			icon: <Wallet />,
			label: _("plan"),
			href: "/panel/organization/plan",
			des: _("plan_des"),
		},
		{
			icon: <Truck />,
			label: _("deliveries"),
			href: "/panel/organization/deliveries",
			des: _("deliveries_des"),
		},
		{
			icon: <Users />,
			label: _("members"),
			href: "/panel/organization/members",
			des: _("members_des"),
		},
		{
			icon: <Settings />,
			label: _("settings"),
			href: "/panel/organization/settings",
			des: _("settings_des"),
		},
	];

	return (
		<section>
			<header className="flex flex-col space-y-3 mb-5">
				<h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
					{_("organization")}
				</h1>

				<p>{_("organization_des")}</p>
			</header>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
				{LINKS.map((link) => {
					return (
						<Link href={link.href} key={link.href}>
							<Card className="hover:shadow-md">
								<CardHeader>
									<CardTitle className="gap-x-3 flex">
										{link.icon} {link.label}
									</CardTitle>
									<CardDescription>{link.des}</CardDescription>
								</CardHeader>
							</Card>
						</Link>
					);
				})}
			</div>
		</section>
	);
}
