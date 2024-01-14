import { Suspense } from "react";
import {
	NextIntlClientProvider,
	useMessages,
	useTranslations,
} from "next-intl";

import { Separator } from "@/components/ui/separator";
import { CardSkeleton } from "@/components/skeletons/card";

import { Organization } from "../_components/organization/organization";
import { ActiveArea } from "../_components/active-area";
import { SellsChart } from "./sells-chart";
import { TimeChange } from "./_components/time-change";
import { DashbordChartAndCardsSkeleton } from "@/components/skeletons/dashboard-chart";
import { TopProducts } from "./top-products";
import { TopSellAreas } from "./top-sell-areas";
import { unstable_setRequestLocale } from "next-intl/server";

export default function Dashboard({
	searchParams,
	params: { locale },
}: {
	searchParams: { limit: number };
	params: { locale: string };
}) {
	unstable_setRequestLocale(locale);
	const currentLimit = Number(searchParams.limit) || 7;
	const _ = useTranslations("dashboard");
	const messages = useMessages();

	return (
		<>
			<main className="[grid-area:main] flex flex-col">
				<section>
					<header className="flex flex-col space-y-3 mb-8">
						<div className="flex flex-row items-center justify-between">
							<div className="flex flex-col gap-3">
								<h1 className="text-4xl font-extrabold tracking-tight ">
									{_("dashboard")}
								</h1>
							</div>
							<div>
								<NextIntlClientProvider
									messages={{ dashboard: messages.dashboard }}
								>
									<TimeChange limit={currentLimit} />
								</NextIntlClientProvider>
							</div>
						</div>
					</header>

					<Suspense
						key={currentLimit}
						fallback={<DashbordChartAndCardsSkeleton />}
					>
						<SellsChart limit={currentLimit} />
					</Suspense>

					<Separator className="my-10" />

					<div className="grid md:grid-cols-2 grid-cols-1 gap-5 items-start">
						<Suspense fallback={<CardSkeleton />}>
							<TopProducts limit={currentLimit} />
						</Suspense>
						<Suspense fallback={<CardSkeleton />}>
							<TopSellAreas limit={currentLimit} />
						</Suspense>
					</div>
				</section>
			</main>

			<aside className="[grid-area:aside]">
				<Suspense fallback={<CardSkeleton />}>
					<ActiveArea />
				</Suspense>

				<NextIntlClientProvider
					messages={{ organization: messages.organization }}
				>
					<Organization />
				</NextIntlClientProvider>
			</aside>
		</>
	);
}