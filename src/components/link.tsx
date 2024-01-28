"use client";
import { useLocale } from "next-intl";
import CoreLink from "next/link";

export function Link({
	href,
	target,
	locale,
	className,
	children,
}: {
	href: string;
	target?: "_blank" | "_self";
	locale?: string;
	className?: string;
	children: React.ReactNode;
}) {
	const actualLocale = useLocale();

	const toLocale = locale ? locale : actualLocale;

	return (
		<CoreLink
			href={href}
			locale={toLocale}
			target={target}
			className={className}
		>
			{children}
		</CoreLink>
	);
}

export default Link;
