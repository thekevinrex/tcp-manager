"use client";

import {
	ClerkLoaded,
	ClerkLoading,
	SignedIn,
	SignedOut,
	UserButton,
	useAuth,
} from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/page/logo";
import Link from "@/components/link";
import { Button } from "@/components/ui/button";
import ModeToggle from "@/components/mode-toggle";
import { AvatarSkeleton } from "@/components/skeletons/header";

export function Header() {
	const _ = useTranslations("header");
	const pathname = usePathname();

	const { orgId } = useAuth();

	return (
		<nav className="flex items-center justify-between gap-3 h-16 w-full border-b max-w-screen-xl px-3">
			<div className="flex items-center space-x-3 w-full max-w-screen-sm">
				<Logo />
			</div>

			<div className="flex justify-end space-x-5 shrink-0">
				<ModeToggle />

				<ClerkLoading>
					<AvatarSkeleton />
				</ClerkLoading>
				<ClerkLoaded>
					<SignedIn>
						{orgId && (
							<Button asChild variant={"outline"}>
								<Link href={"/panel/dashboard"}>{_("dashboard")}</Link>
							</Button>
						)}

						<UserButton afterSignOutUrl="/" />
					</SignedIn>
					<SignedOut>
						{!pathname.endsWith("/sign-in") ? (
							<Button variant={"link"} asChild>
								<Link href={"/sign-in"}>{_("sign_in")}</Link>
							</Button>
						) : (
							<Button variant={"link"} asChild>
								<Link href={"/sign-up"}>{_("sign_up")}</Link>
							</Button>
						)}
					</SignedOut>
				</ClerkLoaded>
			</div>
		</nav>
	);
}
