import { unstable_setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

import { ReelSkeleton } from "@/components/skeletons/reel";

import { HeroSection } from "./_components/hero-section";
import { TopOrganizations } from "./top-organizations";
import { TopProducts } from "./top-products";

export default function RootPage({
	params: { locale },
}: {
	params: { locale: string };
}) {
	unstable_setRequestLocale(locale);

	return (
		<>
			<HeroSection />

			<div className="w-full flex items-center justify-center px-5">
				<div className="w-full max-w-screen-xl flex flex-col">
					<Suspense fallback={<ReelSkeleton />}>
						<TopOrganizations />
					</Suspense>

					<Suspense fallback={<ReelSkeleton />}>
						<TopProducts />
					</Suspense>
				</div>
			</div>
		</>
	);
}
