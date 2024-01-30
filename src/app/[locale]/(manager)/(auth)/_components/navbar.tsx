"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { Logo } from "@/components/page/logo";
import ModeToggle from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import Link from "@/components/link";

export function Navbar({ locale }: { locale: string }) {
	const pathname = usePathname();
	const _ = useTranslations("header");

	return (
		<nav className="sticky w-full top-0 flex justify-between gap-x-5 bg-background border-b h-16 items-center px-5 z-50">
			<Logo />

			<div className="flex">
				<ModeToggle />

				{!pathname.endsWith("/sign-in") ? (
					<Button variant={"link"} asChild>
						<Link href={`/${locale}/sign-in`}>{_("sign_in")}</Link>
					</Button>
				) : (
					<Button variant={"link"} asChild>
						<Link href={`/${locale}/sign-up`}>{_("sign_up")}</Link>
					</Button>
				)}
			</div>
		</nav>
	);
}
