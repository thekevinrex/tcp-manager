import Link from "next/link";
import { BarChart3, ListMinus } from "lucide-react";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CardFetchError } from "@/components/error/CardFetchError";

import { FinalizeArea } from "../area/_components/finalice-area";
import { formatDate } from "@/lib/utils";

import { getActiveArea } from "@/fetchs/sell-area";
import { getProductSelledArea } from "@/fetchs/sells";
import { ActiveAreaStats } from "./active-area-stats";
import { CreateArea } from "../area/_components/create-area";
import { getMessages, getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

export async function ActiveArea() {
	const response = await getActiveArea();
	const _ = await getTranslations("areas");
	const messages = await getMessages();

	if (response.error) {
		return <CardFetchError error={response.error} />;
	}

	if (!response.data) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>{_("no_active_area")}</CardTitle>
					<CardDescription>{_("no_active_area_des")}</CardDescription>
				</CardHeader>
				<CardContent>
					<NextIntlClientProvider
						messages={{ areas: messages.areas, alert: messages.alert }}
					>
						<CreateArea />
					</NextIntlClientProvider>
				</CardContent>
			</Card>
		);
	}

	const { createdAt } = response.data;

	const responseSells = await getProductSelledArea(response.data);

	if (responseSells.error) {
		return <CardFetchError error={response.error} />;
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>{_("active_sell_area")}</CardTitle>
				<CardDescription>{_("active_sell_area_des")}</CardDescription>
			</CardHeader>

			<CardContent>
				<div className="flex flex-col space-y-5">
					<h2>{formatDate({ f: createdAt, format: _("date_time_f") })}</h2>

					{responseSells.data !== undefined && (
						<ActiveAreaStats sells={responseSells.data} />
					)}

					<div className="flex justify-between gap-3">
						<Button
							type="button"
							variant={"secondary"}
							asChild
							className="shrink-0"
						>
							<Link href={`/panel/area/dashboard/${response.data.id}`}>
								<BarChart3 />
							</Link>
						</Button>

						<Button
							variant={"secondary"}
							asChild
							className="shrink-0"
							type="button"
						>
							<Link href={`/panel/area/dashboard/${response.data.id}/sells`}>
								<ListMinus />
							</Link>
						</Button>

						<div className="w-full flex flex-1 flex-grow">
							<NextIntlClientProvider
								messages={{ areas: messages.areas, alert: messages.alert }}
							>
								<FinalizeArea area={response.data} />
							</NextIntlClientProvider>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
