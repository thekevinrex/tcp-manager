"use client";

import Link from "next/link";
import {
	ClerkLoaded,
	ClerkLoading,
	SignInButton,
	SignedIn,
	SignedOut,
	UserButton,
} from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

import { OrganizationHeader } from "./organization/organization-header";

import {
	AvatarSkeleton,
	Organizationskeleton,
} from "@/components/skeletons/header";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { AlignJustify, Home } from "lucide-react";
import { useState } from "react";

const AuthButton = () => {
	return (
		<>
			<SignedIn>
				{/* Mount the UserButton component */}
				<ClerkLoading>
					<AvatarSkeleton />
				</ClerkLoading>
				<ClerkLoaded>
					<UserButton afterSignOutUrl="/" />
				</ClerkLoaded>
			</SignedIn>
			<SignedOut>
				{/* Signed out users get sign in button */}
				<SignInButton />
			</SignedOut>
		</>
	);
};

const LINKS = [
	{
		label: "Products",
		href: "/panel/products",
	},
	{
		label: "Inventories",
		href: "/panel/inventory",
	},
	{
		label: "Sell area",
		href: "/panel/sell-area",
	},
	{
		label: "Areas",
		href: "/panel/area/dashboard",
	},
];

export const PageHeader = () => {
	const pathname = usePathname();
	const [open, setOpen] = useState(false);

	return (
		<nav className="w-full h-full flex">
			<div className="w-full h-full flex flex-row place-items-center justify-between px-3">
				<div className="justify-self-start flex gap-3 items-center">
					<div className="flex lg:hidden">
						<Button variant={"ghost"} onClick={() => setOpen(!open)}>
							<AlignJustify />
						</Button>
					</div>
					<ClerkLoaded>
						<OrganizationHeader />
					</ClerkLoaded>
					<ClerkLoading>
						<Organizationskeleton />
					</ClerkLoading>
				</div>

				<div className=" justify-between hidden lg:flex items-center gap-3">
					<Button
						onClick={() => setOpen(false)}
						variant={"/panel/dashboard" === pathname ? "default" : "secondary"}
						asChild
					>
						<Link href="/panel/dashboard">
							<Home />
						</Link>
					</Button>

					{LINKS.map((link) => {
						return (
							<Button
								key={link.href}
								onClick={() => setOpen(false)}
								variant={link.href === pathname ? "default" : "secondary"}
								asChild
							>
								<Link href={link.href}>{link.label}</Link>
							</Button>
						);
					})}
				</div>

				<div className="justify-self-end flex justify-between gap-3 items-center">
					<ModeToggle />
					<AuthButton />
				</div>
			</div>

			<div
				className={cn(
					"absolute top-full mt-3 border rounded-md p-6 left-0 w-full z-50 bg-background shadow-xl",
					{
						hidden: !open,
					}
				)}
			>
				<div className=" flex flex-col space-y-3">
					<Button
						className="w-full justify-start"
						variant={"/panel/dashboard" === pathname ? "default" : "outline"}
						asChild
						onClick={() => setOpen(false)}
					>
						<Link href="/panel/dashboard" className="w-full flex">
							Dashboard
						</Link>
					</Button>

					{LINKS.map((link) => {
						return (
							<Button
								className="w-full justify-start"
								variant={link.href === pathname ? "default" : "outline"}
								asChild
								key={link.href}
								onClick={() => setOpen(false)}
							>
								<Link href={link.href} className="w-full flex">
									{link.label}
								</Link>
							</Button>
						);
					})}
				</div>
			</div>
		</nav>
	);
};

export default PageHeader;
