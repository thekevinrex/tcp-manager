"use client";

import { DrawerBottom } from "@/components/drawer";
import { Button } from "@/components/ui/button";
import {
	DrawerClose,
	DrawerFooter,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
	ArrowDown10,
	ArrowUp10,
	BadgeDollarSign,
	ChevronLeft,
	DollarSign,
	Search,
	X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function FiltersProducts() {
	const _ = useTranslations("home");

	const { replace } = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();

	const handleDeleteSearch = () => {
		const url = new URLSearchParams(searchParams);

		url.delete("q");

		replace(`${pathname}?${url.toString()}`);
	};

	const order = searchParams.get("order") || null;
	const filters = [
		{
			key: "min",
			value: searchParams.get("min") || null,
			label: "min",
			icon: <DollarSign />,
		},
		{
			key: "max",
			value: searchParams.get("max") || null,
			label: "max",
			icon: <DollarSign />,
		},
		{
			key: "order",
			value: order,
			label: order,
			icon: order === "price_asc" ? <ArrowDown10 /> : <ArrowUp10 />,
		},
	];

	return (
		<div className="flex gap-x-5 flex-wrap">
			{searchParams.get("q") && (
				<FilterButton onClick={handleDeleteSearch} className="flex gap-x-3">
					<Search /> {searchParams.get("q")}
				</FilterButton>
			)}

			{filters
				.filter((f) => f.value !== null)
				.map((filter) => (
					<FilterButton
						key={filter.key}
						className="flex gap-x-3"
						onClick={() => {
							const url = new URLSearchParams(searchParams);

							url.delete(filter.key);

							replace(`${pathname}?${url.toString()}`);
						}}
					>
						{filter.icon}
						{_(filter.label)}{" "}
						{["min", "max"].includes(filter.key) ? `- ${filter.value}` : ""}
					</FilterButton>
				))}

			{(filters.filter((f) => f.value !== null).length > 0 ||
				searchParams.get("q") !== null) && (
				<FilterButton
					onClick={() => replace(`${pathname}`)}
					className="flex gap-x-3"
				>
					<X />
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

	const [min, setMin] = useState(searchParams.get("min") || 0);
	const [max, setMax] = useState(searchParams.get("max") || 0);
	const [order, setOrder] = useState<null | string>(
		searchParams.get("order") || null
	);

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

		if (min !== 0) {
			url.set("min", min.toString());
		} else {
			url.delete("min");
		}

		if (max !== 0) {
			url.set("max", max.toString());
		} else {
			url.delete("max");
		}

		if (order) {
			url.set("order", order);
		} else {
			url.delete("order");
		}

		return `${pathname}?${url.toString()}`;
	};

	useEffect(() => {
		const url = new URLSearchParams(searchParams);

		setMin(url.get("min") || 0);
		setMax(url.get("max") || 0);
		setOrder(url.get("order") || null);
	}, [searchParams]);

	const ORDERS = [
		{
			id: "price_asc",
			label: _("price_asc"),
			icon: <ArrowDown10 />,
		},
		{
			id: "price_desc",
			label: _("price_desc"),
			icon: <ArrowUp10 />,
		},
	];

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
			<div className="flex flex-col md:flex-row w-full max-w-sm md:max-w-screen-lg gap-4 max-md:items-center justify-center">
				<div className="flex flex-col gap-y-4 max-w-sm p-4">
					<label className="text-xs flex flex-col gap-y-2">
						{_("search_product")}
						<Input
							placeholder={_("search_product")}
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</label>

					<label className="text-xs flex flex-col gap-y-2">
						{_("prices")}
						<div className="flex w-full justify-between gap-x-3 flex-row items-center">
							<Input
								placeholder={_("min")}
								value={min}
								type="number"
								onChange={(e) => {
									const value = parseInt(e.target.value) || 0;
									if (value >= 0) {
										setMin(value);
									}
								}}
							/>
							<div className="flex gap-x-1 shrink-0">
								<ChevronLeft />
								<BadgeDollarSign />
								<ChevronLeft />
							</div>
							<Input
								placeholder={_("max")}
								value={max}
								type="number"
								onChange={(e) => {
									const value = parseInt(e.target.value) || 0;
									if (value >= 0) {
										setMax(value);
									}
								}}
							/>
						</div>
					</label>
				</div>

				<div className="flex flex-col gap-y-4 max-w-sm p-4">
					<div className="flex flex-col gap-y-2">
						<span className="text-xs">{_("orders")}</span>
						<div className="flex flex-row gap-3 flex-wrap items-center justify-center">
							{ORDERS.map(({ id, label, icon }) => (
								<FilterButton
									key={id}
									onClick={() => setOrder(id)}
									className={cn("flex gap-x-3", {
										"bg-foreground text-primary-foreground hover:bg-foreground/70":
											id === order,
									})}
								>
									{icon} {label}
								</FilterButton>
							))}
						</div>
					</div>
				</div>
			</div>
			<DrawerFooter className="flex flex-col gap-3 justify-center max-w-sm w-full">
				<Button onClick={handleFilter}>{_("filtrar")}</Button>
				<DrawerClose asChild>
					<Button variant={"outline"}>{_("close")}</Button>
				</DrawerClose>
			</DrawerFooter>
		</DrawerBottom>
	);
};
