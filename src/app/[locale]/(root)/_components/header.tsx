import { Input } from "@/components/ui/input";
import { Logo } from "@/components/page/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
	ClerkLoaded,
	ClerkLoading,
	SignInButton,
	SignedIn,
	SignedOut,
	UserButton,
} from "@clerk/nextjs";
import ModeToggle from "@/components/mode-toggle";
import { AvatarSkeleton } from "@/components/skeletons/header";
import { useTranslations } from "next-intl";

export function Header() {
	const _ = useTranslations("header");

	return (
		<nav className="flex items-center justify-between gap-3 h-16 w-full border-b shadow-sm max-w-screen-xl px-3">
			<div className="flex items-center space-x-3 w-full max-w-screen-sm">
				<Logo />

				<Input placeholder={_("search")} />
			</div>

			<div className="flex justify-end space-x-5 shrink-0">
				<ModeToggle />

				<SignedIn>
					<Button asChild variant={"outline"}>
						<Link href={"/panel/dashboard"}>{_("panel")}</Link>
					</Button>

					<ClerkLoading>
						<AvatarSkeleton />
					</ClerkLoading>
					<ClerkLoaded>
						<UserButton afterSignOutUrl="/" />
					</ClerkLoaded>
				</SignedIn>
				<SignedOut>
					<Button asChild variant={"outline"}>
						<Link href={"/panel"}>{_("panel")}</Link>
					</Button>
					<Button variant={"link"} asChild>
						<Link href={"/sign-in"}>{_("sign_in")}</Link>
					</Button>
				</SignedOut>
			</div>
		</nav>
	);
}
