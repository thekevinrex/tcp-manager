import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const CardStatItem = ({
	title,
	total,
	icon,
}: {
	title: string;
	total: number | string;
	icon: JSX.Element;
}) => {
	return (
		<Card className="">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				{icon}
			</CardHeader>

			<CardContent>
				<div className="text-2xl font-bold">{total}</div>
			</CardContent>
		</Card>
	);
};
