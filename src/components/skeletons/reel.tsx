import { Skeleton } from "../ui/skeleton";

export function ReelSkeleton({ max = 4 }: { max?: number }) {
	return (
		<section className="mb-32 text-center lg:text-left">
			<div className="flex justify-between items-center mb-12">
				<h2 className="text-3xl font-bold">
					<Skeleton className="w-[250px] h-14" />
				</h2>

				<div className="flex items-center shrink-0">
					<Skeleton className="w-[100px] h-10" />
				</div>
			</div>

			<div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{[...Array(max)].map((num, i) => {
					return <ReelSkeletonItem key={i} />;
				})}
			</div>
		</section>
	);
}

export const ReelSkeletonItem = () => (
	<div className="mb-12 lg:mb-0">
		<div className="relative mb-6 overflow-hidden rounded-lg bg-cover bg-no-repeat shadow-lg dark:shadow-black/20 bg-[50%]">
			<Skeleton className="w-full max-h-[200px] h-auto min-h-[150px]" />
		</div>
		<h5 className="mb-4 text-lg font-bold">
			<Skeleton className="w-[80%] h-8" />
		</h5>

		<div className="flex flex-col space-y-3 mt-5">
			<Skeleton className="w-[60%] h-6" />
			<Skeleton className="w-[60%] h-6" />
		</div>
	</div>
);
