import Link from "next/link";
import { Edit } from "lucide-react";

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

export async function ActiveArea() {
	const response = await getActiveArea();

	if (response.error) {
		return <CardFetchError error={response.error} />;
	}

	if (!response.data) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>No active sell area</CardTitle>
					<CardDescription>
						If you dont have an active sell area you cant sell any product
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Link href="/panel/area/create">
						<Button>Create sell area</Button>
					</Link>
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
				<CardTitle>Active Sell area</CardTitle>
				<CardDescription>
					This card shows the active sell area actual information like the total
					of sell, total of earns
				</CardDescription>
			</CardHeader>

			<CardContent>
				<div className="flex flex-col space-y-5">
					<h2>
						{formatDate({ f: createdAt, format: "Empezo el :d a las :t" })}
					</h2>

					{responseSells.data !== undefined && (
						<ActiveAreaStats sells={responseSells.data} />
					)}

					<div className="flex justify-between gap-3">
						<Link href={"/panel/area/edit"} className="shrink-0">
							<Button type="button" variant={"secondary"}>
								<Edit />
							</Button>
						</Link>
						<div className="w-full flex flex-1 flex-grow">
							<FinalizeArea area={response.data} />
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
