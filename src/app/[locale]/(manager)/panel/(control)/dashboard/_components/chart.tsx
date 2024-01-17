"use client";
import { useMemo, useState } from "react";
import {
	Bar,
	BarChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { useTranslations } from "next-intl";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SellAreaWithProductAndSells } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export function Chart({
	data,
	limit,
}: {
	data: SellAreaWithProductAndSells[];
	limit: number;
}) {
	const _ = useTranslations("dashboard");
	const [tab, setTab] = useState("total");

	const customTooltip = ({ payload, label, active }: any) => {
		if (active) {
			return (
				<div className="bg-background rounded-md border flex flex-col p-5 space-y-2 shadow-md">
					<span className="text-sm ">{label}</span>
					<div className="text-lg text-green-400 font-bold tracking-wider">
						{formatCurrency(payload[0]?.value)}
					</div>
				</div>
			);
		}

		return null;
	};

	const handleChange = (value: string) => {
		setTab(value);
	};

	const charData = useMemo(() => {
		const chart = data
			.map<{
				name: string;
				total: number;
				earned: number;
			}>((item) => {
				return {
					name: formatDate({ f: item.createdAt, t: false }),
					total: item.Sells.reduce((acc, item) => {
						return acc + item.cant * item.price;
					}, 0),
					earned: item.Sells.reduce((acc, item) => {
						return (
							acc +
							item.inventories.reduce((acc, invent) => {
								return acc + (item.price - invent.price) * invent.cant;
							}, 0)
						);
					}, 0),
				};
			})
			.reverse();

		const length = chart.length;

		if (length < limit) {
			for (let i = 0; i < limit - length; i++) {
				chart.unshift({
					name: "-",
					total: 0,
					earned: 0,
				});
			}
		}

		return chart;
	}, [data, limit]);

	return (
		<>
			<div className="my-5">
				<Tabs value={tab} onValueChange={handleChange} className="w-[400px]">
					<TabsList>
						<TabsTrigger value="total">{_("sells")}</TabsTrigger>
						<TabsTrigger value="earned">{_("earned")}</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			<div className="w-full flex border rounded-md md:px-3  pt-10">
				<ResponsiveContainer width="100%" height={350}>
					<BarChart data={charData}>
						<XAxis
							dataKey="name"
							stroke="#888888"
							fontSize={12}
							tickLine={false}
							axisLine={false}
						/>
						<YAxis
							stroke="#888888"
							fontSize={12}
							tickLine={false}
							axisLine={false}
							tickFormatter={(value) => `$${value}`}
						/>
						<Bar
							dataKey={tab}
							fill="currentColor"
							radius={[4, 4, 0, 0]}
							className="fill-primary"
						/>

						<Tooltip cursor={false} content={customTooltip} />
					</BarChart>
				</ResponsiveContainer>
			</div>
		</>
	);
}
