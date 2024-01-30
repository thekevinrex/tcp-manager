"use client";

import {
	Bar,
	BarChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import { CardStatItem } from "@/components/card-stat-item";
import { useTranslations } from "next-intl";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

type StatsItem = {
	title: string;
	id: string;
	charData?: {
		keys: Array<{ key: string; label: string; format?: boolean }>;
		data: Array<any>;
	};
	stats?: Array<{
		label: string;
		value: string | string[] | number;
		icon: JSX.Element;
	}>;
};

export const ProductStatItem = ({ title, charData, stats, id }: StatsItem) => {
	const _ = useTranslations("products");
	const [tab, setTab] = useState<string | undefined>(
		charData ? charData.keys[0].key : undefined
	);

	const customTooltip = ({ payload, label, active }: any) => {
		if (active) {
			const key = charData?.keys.find((item) => item.key === tab);

			return (
				<div className="bg-background rounded-md border flex flex-col p-5 space-y-2 shadow-md">
					<span className="text-sm ">{formatX(label)}</span>
					<div className="text-lg text-green-400 font-bold tracking-wider">
						{key && key.format !== undefined && !key.format
							? payload[0]?.value
							: formatCurrency(payload[0]?.value)}
					</div>
				</div>
			);
		}

		return null;
	};

	const formatX = (value: string | number) => {
		if (typeof value === "string") {
			return value;
		}

		const date = new Date(value);

		return formatDate({ f: date, t: false });
	};

	const formatY = (value: string | number) => {
		const key = charData?.keys.find((item) => item.key === tab);

		if (key && key.format !== undefined && !key.format) {
			return String(value);
		}

		if (typeof value === "string") {
			return value;
		}

		return formatCurrency(value);
	};

	return (
		<section id={id} className="flex flex-col gap-y-5">
			<header>
				<h2 className="text-xl md:text-2xl font-semibold">{title}</h2>
			</header>

			{charData && tab && (
				<div className="flex flex-col gap-y-2">
					<div className="flex">
						<Tabs
							value={tab}
							onValueChange={(value) => setTab(value)}
							className="w-[400px]"
						>
							<TabsList>
								{charData.keys.map(({ key, label }) => (
									<TabsTrigger key={key} value={key}>
										{_(label)}
									</TabsTrigger>
								))}
							</TabsList>
						</Tabs>
					</div>

					<div className="w-full flex border rounded-md md:px-3  pt-10">
						<ResponsiveContainer width="100%" height={350}>
							<BarChart data={charData.data}>
								<XAxis
									dataKey="name"
									stroke="#888888"
									fontSize={12}
									tickLine={false}
									axisLine={false}
									tickFormatter={formatX}
								/>
								<YAxis
									stroke="#888888"
									fontSize={12}
									tickLine={false}
									axisLine={false}
									tickFormatter={formatY}
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
				</div>
			)}

			{stats && (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					{stats.map(({ label, value, icon }) => {
						return (
							<CardStatItem
								icon={icon}
								title={_(label)}
								total={value}
								key={label}
							/>
						);
					})}
				</div>
			)}
		</section>
	);
};
