"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import Link from "@/components/link";

const Limits: Array<number> = [7, 15, 30];

export function TimeChange({ limit }: { limit: number }) {
	const pathname = usePathname();
	const params = useSearchParams();
	const _ = useTranslations("dashboard");

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
						? _("last_areas", { lasts: limit })
						: _("select_last_areas")}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				{Limits.map((limit) => {
					return (
						<Link href={generateLink(limit)} key={limit}>
							<DropdownMenuItem>
								{_("last_areas", { lasts: limit })}
							</DropdownMenuItem>
						</Link>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
