import { CardSkeleton } from "@/components/skeletons/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";

export default function Loading() {
	const _ = useTranslations("areas");

	return (
		<>
			<main className="[grid-area:main] flex flex-col">
				<section>
					<header className="flex flex-col space-y-3 mb-5">
						<div className="flex flex-row items-center justify-between">
							<div className="flex flex-col gap-3">
								<h1 className="text-4xl font-extrabold tracking-tight ">
									{_("sell_area")}
								</h1>

								<p>{_("sell_area_des")}</p>
							</div>
						</div>
					</header>

					<div className="flex flex-col gap-5">
						<article className="flex w-full flex-col sm:flex-row border bg-background rounded-md sm:items-center justify-between gap-3 p-4">
							<Skeleton className="w-[200px] h-10" />

							<div className="flex items-center gap-x-3">
								<Skeleton className="w-[100px] h-10" />

								<Skeleton className="w-10 h-10" />

								<Skeleton className="w-12 h-10" />
							</div>
						</article>
						<article className="flex w-full flex-col sm:flex-row border bg-background rounded-md sm:items-center justify-between gap-3 p-4">
							<Skeleton className="w-[200px] h-10" />

							<div className="flex items-center gap-x-3">
								<Skeleton className="w-[100px] h-10" />

								<Skeleton className="w-10 h-10" />

								<Skeleton className="w-12 h-10" />
							</div>
						</article>
						<article className="flex w-full flex-col sm:flex-row border bg-background rounded-md sm:items-center justify-between gap-3 p-4">
							<Skeleton className="w-[200px] h-10" />

							<div className="flex items-center gap-x-3">
								<Skeleton className="w-[100px] h-10" />

								<Skeleton className="w-10 h-10" />

								<Skeleton className="w-12 h-10" />
							</div>
						</article>
						<article className="flex w-full flex-col sm:flex-row border bg-background rounded-md sm:items-center justify-between gap-3 p-4">
							<Skeleton className="w-[200px] h-10" />

							<div className="flex items-center gap-x-3">
								<Skeleton className="w-[100px] h-10" />

								<Skeleton className="w-10 h-10" />

								<Skeleton className="w-12 h-10" />
							</div>
						</article>
						<article className="flex w-full flex-col sm:flex-row border bg-background rounded-md sm:items-center justify-between gap-3 p-4">
							<Skeleton className="w-[200px] h-10" />

							<div className="flex items-center gap-x-3">
								<Skeleton className="w-[100px] h-10" />

								<Skeleton className="w-10 h-10" />

								<Skeleton className="w-12 h-10" />
							</div>
						</article>
						<article className="flex w-full flex-col sm:flex-row border bg-background rounded-md sm:items-center justify-between gap-3 p-4">
							<Skeleton className="w-[200px] h-10" />

							<div className="flex items-center gap-x-3">
								<Skeleton className="w-[100px] h-10" />

								<Skeleton className="w-10 h-10" />

								<Skeleton className="w-12 h-10" />
							</div>
						</article>
					</div>
				</section>
			</main>

			<aside className="[grid-area:aside] overflow-y-auto overflow-x-hidden sticky top-0 block ">
				<CardSkeleton />
			</aside>
		</>
	);
}
