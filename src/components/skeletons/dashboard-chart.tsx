import { Skeleton } from "../ui/skeleton";

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

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-5">
				<Skeleton className="w-auto h-[120px] rounded-md" />
				<Skeleton className="w-auto h-[120px] rounded-md" />
				<Skeleton className="w-auto h-[120px] rounded-md" />
				<Skeleton className="w-auto h-[120px] rounded-md" />
			</div>
		</div>
	);
}
