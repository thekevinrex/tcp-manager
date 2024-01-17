import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BarChart3, ListMinus, Pencil, X } from "lucide-react";
import Link from "next/link";
import { FinalizeArea } from "../../area/_components/finalice-area";
import { SellArea } from "@prisma/client";
import { formatDate } from "@/lib/utils";
import { useTranslations } from "next-intl";

export const AreaInfo = ({
	area,
	search,
	handleSearch,
	disabled,
}: {
	area: SellArea;
	search: string;
	handleSearch: (value: string) => void;
	disabled: boolean;
}) => {
	const _ = useTranslations("areas");
	const { createdAt, id } = area;

	return (
		<div className="flex flex-col">
			<h2>{formatDate({ f: createdAt, format: _("date_time_f") })}</h2>

			<div className="flex justify-between w-full py-5">
				<div className="w-full flex items-center relative">
					<Input
						placeholder={_("sell_area_search")}
						onChange={(e) => handleSearch(e.target.value)}
						value={search}
						disabled={disabled}
						name="search"
					/>
					{search && (
						<X
							className="absolute right-4 z-10 cursor-pointer"
							onClick={() => handleSearch("")}
						/>
					)}
				</div>

				<div className="flex space-x-3 ml-3">
					<Link href={`/panel/area/dashboard/${id}`}>
						<Button variant={"secondary"} disabled={disabled}>
							<BarChart3 />
						</Button>
					</Link>

					<Link href={`/panel/area/dashboard/${id}/sells`}>
						<Button variant={"secondary"} disabled={disabled}>
							<ListMinus />
						</Button>
					</Link>

					<FinalizeArea disabled={disabled} area={area} />
				</div>
			</div>
		</div>
	);
};
