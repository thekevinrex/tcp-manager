import { Skeleton } from "../ui/skeleton";

export function FormSkeleton({ max = 6 }: { max?: number }) {
	return (
		<div className="flex flex-col gap-8">
			{[...Array(max)].map((i, x) => (
				<FormItemSkeleton key={i} />
			))}
		</div>
	);
}

const FormItemSkeleton = () => (
	<div className="flex flex-col gap-y-3">
		<Skeleton className="w-[150px] h-6" />

		<Skeleton className="w-full h-10" />
	</div>
);
