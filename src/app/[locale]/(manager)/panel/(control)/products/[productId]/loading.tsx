import { CardSkeleton } from "@/components/skeletons/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<section className="flex flex-col md:flex-row gap-5 justify-start items-start">
			<div className="w-full max-w-sm flex flex-col">
				<CardSkeleton />
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
				<Skeleton className="w-auto h-[120px] rounded-md" />
				<Skeleton className="w-auto h-[120px] rounded-md" />
				<Skeleton className="w-auto h-[120px] rounded-md" />
				<Skeleton className="w-auto h-[120px] rounded-md" />
			</div>
		</section>
	);
}
