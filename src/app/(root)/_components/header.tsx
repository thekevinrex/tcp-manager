import { Input } from "@/components/ui/input";
import { Logo } from "./logo";
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

export function Header() {
	return (
		<nav className="flex items-center justify-between gap-3 h-16 w-full border-b shadow-sm max-w-screen-xl px-3">
			<div className="flex items-center space-x-3 w-full max-w-screen-sm">
				<Logo />

				<Input placeholder="Search..." />
			</div>

			<div className="flex justify-end space-x-5 shrink-0">
				<ModeToggle />
				<SignedIn>
					<Button asChild variant={"outline"}>
						<Link href={"/panel/dashboard"}>Panel</Link>
					</Button>

					<ClerkLoading>
						<AvatarSkeleton />
					</ClerkLoading>
					<ClerkLoaded>
						<UserButton afterSignOutUrl="/" />
					</ClerkLoaded>
				</SignedIn>
				<SignedOut>
					<SignInButton />
				</SignedOut>
			</div>
		</nav>
	);
}
