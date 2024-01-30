import { Skeleton } from "../ui/skeleton";

export function CardListSkeleton() {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-5 w-full">
			<Skeleton className="w-auto h-[120px] rounded-md" />
			<Skeleton className="w-auto h-[120px] rounded-md" />
			<Skeleton className="w-auto h-[120px] rounded-md" />
			<Skeleton className="w-auto h-[120px] rounded-md" />
		</div>
	);
}
