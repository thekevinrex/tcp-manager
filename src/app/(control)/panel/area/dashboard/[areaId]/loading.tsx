import { DataTableSkeleton } from "@/components/skeletons/data-table";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingAreaStadistics() {
	return (
		<>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-5">
				<Skeleton className="w-auto h-[120px] rounded-md" />
				<Skeleton className="w-auto h-[120px] rounded-md" />
				<Skeleton className="w-auto h-[120px] rounded-md" />
				<Skeleton className="w-auto h-[120px] rounded-md" />
			</div>

			<div className="flex flex-col space-y-2">
				<h2 className="text-xl font-semibold">Stadistics of each product</h2>
				<p className="text-base text-muted-foreground">
					This is the list of all the products selled in this sell area, with
					the total of sell per product, and the aproximate earn of the product
				</p>

				<DataTableSkeleton />
			</div>
		</>
	);
}
