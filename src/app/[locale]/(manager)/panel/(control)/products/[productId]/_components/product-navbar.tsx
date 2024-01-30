"use client";

import { usePathname } from "next/navigation";

import { BarChart3, Barcode, CreditCard, Home, Settings2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import Link from "@/components/link";

export function ProductNavbar({ productId }: { productId: string }) {
	const pathname = usePathname();
	const _ = useTranslations("labels");

	const NavbarItems = [
		{
			label: _("home"),
			icon: Home,
			href: `/panel/products/${productId}`,
		},
		{
			label: _("stats"),
			icon: BarChart3,
			href: `/panel/products/${productId}/stats`,
		},
		{
			label: _("settings"),
			icon: Settings2,
			href: `/panel/products/${productId}/settings`,
		},
		{
			label: _("sells"),
			icon: CreditCard,
			href: `/panel/products/${productId}/sells`,
		},
		{
			label: _("inventories"),
			icon: Barcode,
			href: `/panel/products/${productId}/inventories`,
		},
	];

	return (
		<nav className="inline-flex items-center space-x-3 justify-center rounded-md bg-muted p-1 text-muted-foreground">
			{NavbarItems.map(({ icon: Icon, href, label }) => (
				<Link href={href} key={href}>
					<NavbarItem active={pathname.endsWith(href)}>
						<Icon />
						<span
							className={cn({
								hidden: !pathname.endsWith(href),
								"hidden sm:flex": pathname.endsWith(href),
							})}
						>
							{label}
						</span>
					</NavbarItem>
				</Link>
			))}
		</nav>
	);
}

const NavbarItem = ({
	children,
	active,
}: {
	children: React.ReactNode;
	active: boolean;
}) => (
	<div
		className={cn(
			"inline-flex items-center justify-center whitespace-nowrap rounded-md px-2 py-1 text-base font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-3",
			{
				"bg-background text-foreground shadow-sm": active,
			}
		)}
	>
		{children}
	</div>
);
