import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { FinalizeArea } from "../../area/_components/finalice-area";
import { SellArea } from "@prisma/client";
import { formatDate } from "@/lib/utils";

export const AreaInfo = ({
	area,
	search,
	handleSearch,
}: {
	area: SellArea;
	search: string;
	handleSearch: (value: string) => void;
}) => {
	const { createdAt } = area;

	return (
		<div className="flex flex-col">
			<h2>{formatDate({ f: createdAt, format: "Empezo el :d at :t" })}</h2>

			<div className="flex justify-between w-full py-5">
				<Input
					placeholder="Search products..."
					onChange={(e) => handleSearch(e.target.value)}
					value={search}
					name="search"
				/>

				<div className="flex space-x-3 ml-3">
					<Link href={"/panel/area/edit"}>
						<Button type="button" className="gap-2" variant={"secondary"}>
							<Pencil /> Edit
						</Button>
					</Link>

					<FinalizeArea area={area} />
				</div>
			</div>
		</div>
	);
};
