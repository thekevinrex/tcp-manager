import { useFormStatus } from "react-dom";
import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ProductsWithPrices } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

type Selected = { id: number; cant: number };

export function TableProduct({
	products,
	selecteds,
	selected = false,
	handleSelected,
	handleChange,
}: {
	products: ProductsWithPrices[];
	selecteds?: Selected[];
	selected?: boolean;
	handleSelected: (id: number) => void;
	handleChange?: (value: string, id: number) => void;
}) {
	return (
		<div className="w-full rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Product</TableHead>
						{selected && <TableHead>Cant</TableHead>}
						<TableHead className="text-center">Aviable</TableHead>
						<TableHead className="text-end">Price</TableHead>
						<TableHead></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{selected ? (
						<TableBodySelected
							handle={handleSelected}
							products={products}
							handleChange={handleChange}
							selecteds={selecteds}
						/>
					) : (
						<TableBodyProducts
							handle={handleSelected}
							products={products}
							selecteds={selecteds?.map((sele) => sele.id)}
						/>
					)}
				</TableBody>
			</Table>
		</div>
	);
}

const TableBodySelected = ({
	products,
	selecteds,
	handle,
	handleChange,
}: {
	products: ProductsWithPrices[];
	selecteds?: Selected[];
	handle: (id: number) => void;
	handleChange?: (value: string, id: number) => void;
}) => {
	selecteds =
		selecteds?.filter((sele) => products.find((pro) => pro.id === sele.id)) ||
		selecteds;

	return (
		<>
			{selecteds && selecteds?.length > 0 ? (
				selecteds?.map((selected) => {
					const rowProduct = products.find((pro) => pro.id === selected.id);
					if (!rowProduct) {
						return;
					}

					return (
						<TableBodyRow
							handle={handle}
							handleChange={handleChange}
							key={selected.id}
							row={rowProduct}
							cant={selected.cant}
						/>
					);
				})
			) : (
				<TableNoResults />
			)}
		</>
	);
};

const TableBodyProducts = ({
	products,
	selecteds,
	handle,
}: {
	products: ProductsWithPrices[];
	selecteds?: number[];
	handle: (id: number) => void;
}) => {
	products = products.filter((pro) => !selecteds?.includes(pro.id || 0));

	return (
		<>
			{products.length > 0 ? (
				products.map((product) => {
					return (
						<TableBodyRow handle={handle} key={product.id} row={product} />
					);
				})
			) : (
				<TableNoResults />
			)}
		</>
	);
};
const TableBodyRow = ({
	row,
	cant,
	handle,
	handleChange,
}: {
	row: ProductsWithPrices;
	cant?: number;
	handle: (id: number) => void;
	handleChange?: (value: string, id: number) => void;
}) => {
	const { pending } = useFormStatus();

	return (
		<TableRow>
			<TableCell>{row.name}</TableCell>
			{cant !== undefined && (
				<TableCell>
					<Input
						placeholder="Cant"
						disabled={pending}
						type="number"
						className="max-w-xs min-w-[70px]"
						onChange={(e) => {
							if (handleChange) handleChange(e.target.value, row.id);
						}}
						value={cant}
					/>
				</TableCell>
			)}

			<TableCell className="text-center">{row.aviable}</TableCell>
			<TableCell>
				<div className="flex items-center justify-end">
					<div className="flex flex-col w-auto items-end space-y-2">
						<div className="font-semibold text-lg text-green-500">
							{formatCurrency(row.price)}
						</div>
						{row.prices && row.prices?.length > 0 ? (
							<div className="">
								{row.prices.map(({ id, cant, value }) => {
									return (
										<span key={id} className="text-sm text-muted-foreground">
											{cant} {">"} {formatCurrency(value)}
										</span>
									);
								})}
							</div>
						) : null}
					</div>
				</div>
			</TableCell>

			<TableCell>
				<div className="flex justify-center">
					<Button
						type="button"
						onClick={() => handle(row.id)}
						variant={"secondary"}
						disabled={pending}
					>
						{cant !== undefined ? <Minus /> : <Plus />}
					</Button>
				</div>
			</TableCell>
		</TableRow>
	);
};

const TableNoResults = () => {
	return (
		<TableRow>
			<TableCell colSpan={5} className="h-24 text-center">
				No results.
			</TableCell>
		</TableRow>
	);
};
