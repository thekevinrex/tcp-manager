"use client";

import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useSearchParams } from "next/navigation";

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

	const generateLink = (page: number) => {
		const url = new URLSearchParams(params);

		url.set("page", String(page));

		return `${pathname}?${url.toString()}`;
	};

	let totalItems = 1;
	if (total > 0) {
		totalItems = Math.ceil(total / max);
	}

	let items = [];
	for (let i = -2; i < 3; i++) {
		if (page + i > 0 && page + i <= totalItems) {
			items.push(page + i);
		}
	}

	return (
		<Pagination>
			<PaginationContent>
				{page > 1 && (
					<PaginationItem>
						<PaginationPrevious href={generateLink(page - 1)} />
					</PaginationItem>
				)}

				{items.map((item) => (
					<PaginationItem key={item}>
						<PaginationLink href={generateLink(item)} isActive={item === page}>
							{item}
						</PaginationLink>
					</PaginationItem>
				))}

				{(items.pop() || 0) < totalItems && (
					<PaginationItem>
						<PaginationEllipsis />
					</PaginationItem>
				)}

				{page < totalItems && (
					<PaginationItem>
						<PaginationNext href={generateLink(page + 1)} />
					</PaginationItem>
				)}
			</PaginationContent>
		</Pagination>
	);
};
