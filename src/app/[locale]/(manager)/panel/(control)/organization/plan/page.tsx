import { Suspense } from "react";
import { Barcode, Users, Wallet } from "lucide-react";
import { NextIntlClientProvider } from "next-intl";
import {
	getMessages,
	getTranslations,
	unstable_setRequestLocale,
} from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/skeletons/data-table";
import { FetchFailedError } from "@/components/error/FetchFailed";

import { PLANS } from "@/config/site";
import { Transactions } from "./_components/transactions";
import { UpgradePlan } from "./_components/upgrade-plan";
import { getActualOrganization } from "@/fetchs/organization";
import { Protect } from "@clerk/nextjs";
import { NoPermission } from "@/components/page/no-permission";

export default async function OrganizationPlanPage({
	params: { locale },
}: {
	params: { locale: string };
}) {
	unstable_setRequestLocale(locale);

	const _ = await getTranslations("organization");
	const messages = await getMessages();

	const response = await getActualOrganization();

	if (response.error || !response.data) {
		return <FetchFailedError error={response.error} />;
	}

	const org = response.data;

	return (
		<Protect role="org:admin" fallback={<NoPermission />}>
			<section>
				<header className="flex flex-col space-y-3 mb-5">
					<h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
						{_("organization_plan")}
					</h1>

					<p>{_("plan_des")}</p>
				</header>

				<Alert>
					<AlertTitle className="flex gap-3 items-center">
						<Wallet /> {_("current_plan")} : <Badge>{_(org.plan)}</Badge>
					</AlertTitle>
					<AlertDescription className="flex flex-col gap-y-1 mt-5">
						<div className="text-sm text-muted-foreground flex gap-x-2 items-center">
							<Barcode />
							{_("max_products", {
								total:
									PLANS[org.plan].max_products === -1
										? _("unlimiteds")
										: PLANS[org.plan].max_products,
							})}
						</div>
						<div className="text-sm text-muted-foreground flex gap-x-2 items-center">
							<Users /> {_("cant_members", { total: PLANS[org.plan].members })}
						</div>
					</AlertDescription>
				</Alert>
			</section>

			<NextIntlClientProvider
				messages={{ organization: messages.organization }}
			>
				<UpgradePlan org={org} />
			</NextIntlClientProvider>

			<section>
				<Separator className="my-6" />

				<h2 className="text-2xl font-extrabold tracking-tight">
					{_("transactions")}
				</h2>

				<p>{_("transactions_des")}</p>

				<Suspense fallback={<DataTableSkeleton />}>
					<Transactions org={org} />
				</Suspense>
			</section>
		</Protect>
	);
}
