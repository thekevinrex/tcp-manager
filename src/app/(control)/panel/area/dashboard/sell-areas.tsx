import { BarChart3, Edit, EyeIcon, ListMinus } from "lucide-react";
import Link from "next/link";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import { DeleteArea } from "../_components/delete-area";
import { formatDate } from "@/lib/utils";

import { getAllSellAreas } from "@/fetchs/sell-area";
import { FetchFailedError } from "@/components/error/FetchFailed";

export async function SellAreas() {
	const response = await getAllSellAreas();

	if (response.error || !response.data) {
		return <FetchFailedError error={response.error} />;
	}

	const areas = response.data;

	return (
		<div className="w-full rounded-md border my-6">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Started At</TableHead>
						<TableHead>Ended At</TableHead>
						<TableHead>Sells</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{areas && areas.length > 0 ? (
						areas.map((area) => {
							return (
								<TableRow key={area.id}>
									<TableCell>{formatDate({ f: area.createdAt })}</TableCell>
									<TableCell>
										{area.endedAt
											? formatDate({ f: area.createdAt })
											: "Active"}
									</TableCell>
									<TableCell>{area._count.Sells}</TableCell>
									<TableCell>
										<div className="flex space-x-2">
											<Link href={`/panel/area/dashboard/${area.id}`}>
												<Button variant={"ghost"}>
													<BarChart3 />
												</Button>
											</Link>

											<Link href={`/panel/area/dashboard/${area.id}/sells`}>
												<Button variant={"ghost"}>
													<ListMinus />
												</Button>
											</Link>

											{area.endedAt ? (
												<DeleteArea area={area} />
											) : (
												<Link href={"/panel/area/edit"} className="shrink-0">
													<Button type="button" variant={"secondary"}>
														<Edit /> Edit
													</Button>
												</Link>
											)}
										</div>
									</TableCell>
								</TableRow>
							);
						})
					) : (
						<TableRow>
							<TableCell className="h-24 text-center">
								No sell areas created.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
