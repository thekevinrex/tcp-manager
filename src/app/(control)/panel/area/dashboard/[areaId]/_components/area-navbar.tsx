"use client";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { BarChart3, ListMinus } from "lucide-react";

export function AreaNavbar({ area }: { area: string }) {
	const pathname = usePathname();

	const NavbarItems = [
		{
			label: "Stadistics",
			icon: BarChart3,
			href: `/panel/area/dashboard/${area}`,
		},
		{
			label: "Sells",
			icon: ListMinus,
			href: `/panel/area/dashboard/${area}/sells`,
		},
	];

	return (
		<nav className="inline-flex items-center space-x-3 justify-center rounded-md bg-muted p-2 text-muted-foreground">
			{NavbarItems.map(({ icon: Icon, href, label }) => (
				<Link href={href} key={href}>
					<NavbarItem active={href === pathname}>
						<Icon /> {label}
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
			"inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-lg font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-3",
			{
				"bg-background text-foreground shadow-sm": active,
			}
		)}
	>
		{children}
	</div>
);
