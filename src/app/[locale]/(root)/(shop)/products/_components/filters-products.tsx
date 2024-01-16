"use client";

import { DrawerBottom } from "@/components/drawer";
import { Button } from "@/components/ui/button";
import {
	DrawerClose,
	DrawerFooter,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function FiltersProducts() {
	const _ = useTranslations("home");
	const [open, setOpen] = useState(false);

	const handleFilter = () => {
		setOpen(false);
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
			<div>filtros</div>
			<DrawerFooter className="flex flex-col gap-3 justify-center max-w-sm w-full">
				<DrawerClose asChild>
					<Button variant={"outline"}>{_("close")}</Button>
				</DrawerClose>
				<Button onClick={handleFilter}>{_("filtrar")}</Button>
			</DrawerFooter>
		</DrawerBottom>
	);
}
