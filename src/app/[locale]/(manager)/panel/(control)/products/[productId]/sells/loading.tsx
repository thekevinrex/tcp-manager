import { DataTableSkeleton } from "@/components/skeletons/data-table";

export default function Loading() {
	return (
		<section className="flex flex-col gap-y-5">
			<DataTableSkeleton />
		</section>
	);
}
