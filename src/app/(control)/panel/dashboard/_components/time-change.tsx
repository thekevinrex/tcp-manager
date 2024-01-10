"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const Limits: Array<number> = [7, 15, 30];

export function TimeChange({ limit }: { limit: number }) {
	const pathname = usePathname();
	const params = useSearchParams();

	const generateLink = (limit: number) => {
		const url = new URLSearchParams(params);

		url.set("limit", String(limit));

		return `${pathname}?${url.toString()}`;
	};
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline">
					{Limits.includes(limit)
						? `Last ${limit} sell areas`
						: `Select the cant of sell areas`}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				{Limits.map((limit) => {
					return (
						<Link href={generateLink(limit)} key={limit}>
							<DropdownMenuItem>{`Last ${limit} sell areas`}</DropdownMenuItem>
						</Link>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
