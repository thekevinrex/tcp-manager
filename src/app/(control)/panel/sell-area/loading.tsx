import { CardSkeleton } from "@/components/skeletons/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<>
			<main className="[grid-area:main] flex flex-col">
				<section>
					<header className="flex flex-col space-y-3 mb-5">
						<div className="flex flex-row items-center justify-between">
							<div className="flex flex-col gap-3">
								<h1 className="text-4xl font-extrabold tracking-tight ">
									Sell Area
								</h1>

								<p>The list of all the product ready to sell</p>
							</div>
						</div>
					</header>

					<div className="grid grid-cols-12 gap-5">
						<div className="col-span-full sm:col-span-6 md:col-span-4 lg:col-span-3 flex flex-col space-y-4">
							<Skeleton className="w-full h-[150px]" />
							<Skeleton className="w-[60%] h-5" />
							<Skeleton className="w-[40%] h-3" />
						</div>
						<div className="col-span-full sm:col-span-6 md:col-span-4 lg:col-span-3 flex flex-col space-y-4">
							<Skeleton className="w-full h-[150px]" />
							<Skeleton className="w-[60%] h-5" />
							<Skeleton className="w-[40%] h-3" />
						</div>
						<div className="col-span-full sm:col-span-6 md:col-span-4 lg:col-span-3 flex flex-col space-y-4">
							<Skeleton className="w-full h-[150px]" />
							<Skeleton className="w-[60%] h-5" />
							<Skeleton className="w-[40%] h-3" />
						</div>
						<div className="col-span-full sm:col-span-6 md:col-span-4 lg:col-span-3 flex flex-col space-y-4">
							<Skeleton className="w-full h-[150px]" />
							<Skeleton className="w-[60%] h-5" />
							<Skeleton className="w-[40%] h-3" />
						</div>
						<div className="col-span-full sm:col-span-6 md:col-span-4 lg:col-span-3 flex flex-col space-y-4">
							<Skeleton className="w-full h-[150px]" />
							<Skeleton className="w-[60%] h-5" />
							<Skeleton className="w-[40%] h-3" />
						</div>
						<div className="col-span-full sm:col-span-6 md:col-span-4 lg:col-span-3 flex flex-col space-y-4">
							<Skeleton className="w-full h-[150px]" />
							<Skeleton className="w-[60%] h-5" />
							<Skeleton className="w-[40%] h-3" />
						</div>
						<div className="col-span-full sm:col-span-6 md:col-span-4 lg:col-span-3 flex flex-col space-y-4">
							<Skeleton className="w-full h-[150px]" />
							<Skeleton className="w-[60%] h-5" />
							<Skeleton className="w-[40%] h-3" />
						</div>
					</div>
				</section>
			</main>

			<aside className="[grid-area:aside] overflow-y-auto overflow-x-hidden sticky top-0 block ">
				<CardSkeleton />
			</aside>
		</>
	);
}
