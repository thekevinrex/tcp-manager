"use client";

import Link from "next/link";
import { Building, Settings, Truck, Wallet } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Navbar() {
	const _ = useTranslations("organization");
	const pathname = usePathname();

	const LINKS = [
		{
			icon: <Building />,
			label: _("organization"),
			href: "/panel/organization",
		},
		{ icon: <Wallet />, label: _("plan"), href: "/panel/organization/plan" },
		{
			icon: <Truck />,
			label: _("deliveries"),
			href: "/panel/organization/deliveries",
		},
		{
			icon: <Settings />,
			label: _("settings"),
			href: "/panel/organization/settings",
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
