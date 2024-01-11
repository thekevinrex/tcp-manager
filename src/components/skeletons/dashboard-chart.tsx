import { Skeleton } from "../ui/skeleton";
import { CardListSkeleton } from "./card-list";

export function DashbordChartAndCardsSkeleton() {
	return (
		<div className="flex flex-col space-y-5">
			<div>
				<Skeleton className="h-7 w-[130px]" />
			</div>

			<div className="grid grid-cols-10 gap-5 min-h-[400px] w-full border rounded-md items-end p-10">
				<Skeleton className="w-auto h-[150px]" />
				<Skeleton className="w-auto h-[250px]" />
				<Skeleton className="w-auto h-[220px]" />
				<Skeleton className="w-auto h-[200px]" />
				<Skeleton className="w-auto h-[120px]" />
				<Skeleton className="w-auto h-[230px]" />
				<Skeleton className="w-auto h-[160px]" />
			</div>

			<CardListSkeleton />
		</div>
	);
}
