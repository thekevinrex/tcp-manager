"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMediaQuery } from "@uidotdev/usehooks";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "./ui/label";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "@/components/link";
import { useTranslations } from "next-intl";

const ROWS = [1, 5, 10, 20, 30, 50, 100];

export const PaginationComponent = ({
	total,
	page = 1,
	max = 5,
}: {
	total: number;
	page: number;
	max: number;
}) => {
	const pathname = usePathname();
	const params = useSearchParams();
	const { replace } = useRouter();
	const _ = useTranslations("pagination");

	const generateLink = (page: number) => {
		const url = new URLSearchParams(params);

		url.set("page", String(page));

		return `${pathname}?${url.toString()}`;
	};

	let totalItems = 1;
	if (total > 0) {
		totalItems = Math.ceil(total / max);
	}

	const items = [];
	for (let i = -2; i < 3; i++) {
		if (page + i > 0 && page + i <= totalItems) {
			items.push(page + i);
		}
	}

	const handleRows = (value: string) => {
		const url = new URLSearchParams(params);

		url.set("page", "1");
		url.set("max", value);

		replace(`${pathname}?${url.toString()}`);
	};

	return (
		<div className="flex flex-col md:flex-row gap-5 md:justify-between items-center">
			<div className="flex space-x-5 items-center w-full justify-center">
				<div className="text-xs sm:text-sm tracking-widest font-bold shrink-0">
					{_("pagination_show", { page, totalItems, total })}
				</div>

				<div className="w-[1px] h-8 bg-slate-300 hidden sm:block"></div>

				<div className="flex items-center space-x-3">
					<Select onValueChange={handleRows} defaultValue={String(max)}>
						<SelectTrigger>
							<SelectValue placeholder="" />
						</SelectTrigger>
						<SelectContent>
							{ROWS.map((row) => {
								return (
									<SelectItem key={row} value={String(row)}>
										{row}
									</SelectItem>
								);
							})}
						</SelectContent>
					</Select>
					<Label className="font-bold text-sm shrink-0">{_("rows_page")}</Label>
				</div>
			</div>
			<div>
				<Pagination>
					<PaginationContent>
						{page > 1 && (
							<PaginationItem>
								<PaginationPrevious
									title={_("previous")}
									href={generateLink(page - 1)}
								/>
							</PaginationItem>
						)}

						<div className="items-center hidden sm:flex">
							{items.map((item) => (
								<PaginationItem key={item}>
									<PaginationLink
										href={generateLink(item)}
										isActive={item === page}
									>
										{item}
									</PaginationLink>
								</PaginationItem>
							))}
						</div>

						{(items.pop() || 0) < totalItems ? (
							<PaginationItem>
								<DropdownMenu>
									<DropdownMenuTrigger>
										<PaginationEllipsis />
									</DropdownMenuTrigger>
									<DropdownMenuContent>
										{[...Array(totalItems)].map((x, i) => (
											<DropdownMenuItem key={i} asChild>
												<Link href={generateLink(i + 1)}>
													{_("page", { num: i + 1 })}
												</Link>
											</DropdownMenuItem>
										))}
									</DropdownMenuContent>
								</DropdownMenu>
							</PaginationItem>
						) : null}

						{page < totalItems && (
							<PaginationItem>
								<PaginationNext
									title={_("next")}
									href={generateLink(page + 1)}
								/>
							</PaginationItem>
						)}
					</PaginationContent>
				</Pagination>
			</div>
		</div>
	);
};
