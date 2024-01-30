"use client";

import { Building, Settings, Truck, Users, Wallet } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

import Link from "@/components/link";
import { cn } from "@/lib/utils";

export function Navbar({ locale }: { locale: string }) {
	const _ = useTranslations("organization");
	const pathname = usePathname();

	const LINKS = [
		{
			icon: <Building />,
			label: _("organization"),
			href: `/${locale}/panel/organization`,
		},
		{ icon: <Wallet />, label: _("plan"), href: "/panel/organization/plan" },
		{
			icon: <Truck />,
			label: _("deliveries"),
			href: `/${locale}/panel/organization/deliveries`,
		},
		{
			icon: <Users />,
			label: _("members"),
			href: `/${locale}/panel/organization/members`,
		},
		{
			icon: <Settings />,
			label: _("settings"),
			href: `/${locale}/panel/organization/settings`,
		},
	];

	return (
		<ul className="flex flex-col gap-4 w-full">
			{LINKS.map((link) => {
				const active = pathname.endsWith(link.href);

				return (
					<li
						key={link.href}
						className={cn("flex w-full border rounded-xl hover:shadow-md", {
							"bg-foreground text-primary-foreground": active,
							"": !active,
						})}
					>
						<Link
							href={link.href}
							className="w-full h-full flex gap-x-3 p-2  sm:p-4"
						>
							{link.icon}
							<span className="hidden md:inline-flex">{link.label}</span>
						</Link>
					</li>
				);
			})}
		</ul>
	);
}
