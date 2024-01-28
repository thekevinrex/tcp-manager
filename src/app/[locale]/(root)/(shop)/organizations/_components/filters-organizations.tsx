"use client";

import { DrawerBottom } from "@/components/drawer";
import { Button } from "@/components/ui/button";
import {
	DrawerClose,
	DrawerFooter,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function FiltersOrganizations() {
	const _ = useTranslations("home");

	const { replace } = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();

	const handleDeleteSearch = () => {
		const url = new URLSearchParams(searchParams);

		url.delete("q");

		replace(`${pathname}?${url.toString()}`);
	};

	return (
		<div className="flex gap-x-5 flex-wrap">
			{searchParams.get("q") && (
				<FilterButton onClick={handleDeleteSearch} className="flex gap-x-3">
					<Search /> {searchParams.get("q")}
				</FilterButton>
			)}

			<AddFilters />
		</div>
	);
}

const FilterButton = ({
	onClick,
	children,
	className,
}: {
	onClick?: () => void;
	children: React.ReactNode;
	className?: string;
}) => {
	return (
		<Button variant="secondary" className={className} onClick={onClick}>
			{children}
		</Button>
	);
};

const AddFilters = () => {
	const _ = useTranslations("home");

	const { replace } = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState(searchParams.get("q") || "");

	const handleFilter = () => {
		setOpen(false);

		replace(generateLink());
	};

	const generateLink = () => {
		const url = new URLSearchParams(searchParams);

		if (search !== "") {
			url.set("q", search);
		} else {
			url.delete("q");
		}

		return `${pathname}?${url.toString()}`;
	};

	return (
		<DrawerBottom
			title={_("filters_title")}
			description={_("filters_description")}
			trigger={
				<DrawerTrigger asChild>
					<Button variant="outline">{_("filtrar")}</Button>
				</DrawerTrigger>
			}
			open={open}
			onChange={(open) => setOpen(open)}
		>
			<div className="flex flex-col w-full max-w-sm p-4">
				<label className="text-xs flex flex-col gap-y-2">
					{_("search_organization")}
					<Input
						placeholder={_("search_organization")}
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</label>
			</div>
			<DrawerFooter className="flex flex-col gap-y-3 justify-center max-w-sm w-full">
				<Button onClick={handleFilter}>{_("filtrar")}</Button>
				<DrawerClose asChild>
					<Button variant={"outline"}>{_("close")}</Button>
				</DrawerClose>
			</DrawerFooter>
		</DrawerBottom>
	);
};
