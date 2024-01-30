import { DashbordChartAndCardsSkeleton } from "@/components/skeletons/dashboard-chart";
import { Separator } from "@/components/ui/separator";

export default function Loading() {
	return (
		<div className="flex flex-col gap-y-8">
			<DashbordChartAndCardsSkeleton />

			<Separator />

			<DashbordChartAndCardsSkeleton />
		</div>
	);
}
