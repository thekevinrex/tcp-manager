import { DataTableSkeleton } from "@/components/skeletons/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function Loading() {
	return (
		<section>
			<header className="flex flex-col space-y-3 mb-5">
				<h1 className="text-4xl font-extrabold tracking-tight">
					Edit sell area
				</h1>

				<p>
					Edit the sell area, to add new products or delete from the sell area,
					also you can update the total of each product to sell
				</p>

				<div className="flex justify-between w-full py-5 gap-5">
					<Input placeholder="Search products..." name="search" />

					<div>
						<Button type="button">{"Save"}</Button>
					</div>
				</div>
			</header>

			<div className="flex flex-col space-y-2">
				<h2 className="text-xl font-semibold">
					The products already selected to the sell area
				</h2>
				<p className="text-base text-muted-foreground">
					This is the list of all the products with his cant that will be
					aviable in the sell area
				</p>

				<DataTableSkeleton max={2} />
			</div>

			<Separator className="my-6" />

			<div className="flex flex-col space-y-2">
				<h2 className="text-xl font-semibold">The products aviables</h2>

				<p className="text-base text-muted-foreground">
					This is the list of all the products that you can add to the sell area
				</p>

				<DataTableSkeleton max={2} />
			</div>
		</section>
	);
}
