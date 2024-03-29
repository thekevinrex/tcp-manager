import { cn } from "@/lib/utils";
import { ChevronRight, Home } from "lucide-react";
import Link from "@/components/link";

export function Breadcrumbs({ children }: { children: React.ReactNode }) {
	return (
		<nav className="w-full flex items-center">
			<ul className="flex flex-wrap items-center gap-5">
				<BreadcrumbsLinkItem href="/">
					<Home /> <span className="sr-only">Home</span>
				</BreadcrumbsLinkItem>
				<BreadcrumbsSeparator />
				{children}
			</ul>
		</nav>
	);
}

export function BreadcrumbsSeparator() {
	return (
		<li>
			<ChevronRight />
		</li>
	);
}

export function BreadcrumbsLinkItem({
	active = false,
	href,
	children,
}: {
	active?: boolean;
	href: string;
	children: React.ReactNode;
}) {
	return (
		<BreadcrumbsItem active={true}>
			<Link href={href}>{children}</Link>
		</BreadcrumbsItem>
	);
}

export function BreadcrumbsItem({
	active = false,
	children,
}: {
	active?: boolean;
	children: React.ReactNode;
}) {
	return (
		<li
			className={cn(
				"transition duration-150 ease-in-out text-xs md:text-base",
				{
					"text-primary  hover:text-primary-600": !active,
					"text-sky-700 hover:text-sky-900": active,
				}
			)}
		>
			{children}
		</li>
	);
}
