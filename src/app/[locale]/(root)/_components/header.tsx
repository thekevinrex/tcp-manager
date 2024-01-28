"use client";

import {
	ClerkLoaded,
	ClerkLoading,
	SignedIn,
	SignedOut,
	UserButton,
} from "@clerk/nextjs";
import { useTranslations } from "next-intl";

import { Logo } from "@/components/page/logo";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/link";

import ModeToggle from "@/components/mode-toggle";
import { AvatarSkeleton } from "@/components/skeletons/header";
import { usePathname } from "next/navigation";

export function Header() {
	const _ = useTranslations("header");

	const pathname = usePathname();

	return (
		<nav className="flex items-center justify-between gap-3 h-16 w-full border-b shadow-sm max-w-screen-xl px-3">
			<div className="flex items-center space-x-3 max-w-screen-sm">
				<Logo />
			</div>

			<div className="items-center space-x-3 hidden md:flex">
				<Button
					asChild
					variant={
						pathname.endsWith("/organizations") ? "default" : "secondary"
					}
				>
					<Link href={"/organizations"}>{_("organizations")}</Link>
				</Button>

				<Button
					asChild
					variant={pathname.endsWith("/products") ? "default" : "secondary"}
				>
					<Link href={"/products"}>{_("products")}</Link>
				</Button>
			</div>

			<div className="flex justify-end space-x-5 shrink-0">
				<ModeToggle />

				<ClerkLoading>
					<AvatarSkeleton />
				</ClerkLoading>
				<ClerkLoaded>
					<SignedIn>
						<Button asChild variant={"outline"}>
							<Link href={"/panel/dashboard"}>{_("dashboard")}</Link>
						</Button>

						<UserButton afterSignOutUrl="/" />
					</SignedIn>
					<SignedOut>
						<Button asChild variant={"outline"}>
							<Link href={"/panel"}>{_("panel")}</Link>
						</Button>
						<Button variant={"link"} asChild>
							<Link href={"/sign-in"}>{_("sign_in")}</Link>
						</Button>
					</SignedOut>
				</ClerkLoaded>
			</div>
		</nav>
	);
}
