"use client";

import { DndContext, DragOverlay, useSensor, useSensors } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { SellArea } from "@prisma/client";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

import { ProductsWithPrices } from "@/lib/types";
import { MouseSensor } from "@/lib/sensors";

import { Button } from "@/components/ui/button";
import { Draggable } from "@/components/draggable";
import Link from "@/components/link";

import { ProductDraggableItem } from "./_components/product-draggable-item";
import { SellForm } from "./_components/sell-form";
import { AreaInfo } from "./_components/area-Info";

import { useAction } from "@/hooks/useAction";
import { newSell } from "@/actions/sell/new-sell";
import { ProductDraggableDetails } from "./_components/product-draggable-details";
import { MAX_SELECTEDS } from "@/config/site";

export type SelectedType = {
	uuid: string;
	id: number;
	added: number;
	price: number | null;
};
export type SelectedFnParams = {
	uuid?: string;
	total?: number;
	price?: number | null;
};
export type SelectedFn = ({ total, price, uuid }: SelectedFnParams) => void;

export function SellArea({
	area,
	areaProducts,
}: {
	area: SellArea;
	areaProducts: ProductsWithPrices[];
}) {
	const _ = useTranslations("areas");

	// Sensor for the drag and drop
	const sensors = useSensors(useSensor(MouseSensor));

	// The selected products to sell (Important)
	const [selectedElements, setSelectedElements] = useState<SelectedType[]>([]);

	// If a product has incriesed the add cant
	const [added, setAdded] = useState<any[]>([]);

	// The active product bing draged
	const [active, setActive] = useState<ProductsWithPrices | null>(null);

	// If the drag and drop active element is over the sell form
	const [isOver, setIsOver] = useState(false);

	// The search input value
	const [search, setSearch] = useState("");

	const [loading, setLoading] = useState<boolean | number>(false);

	// The products that are going to be show after the search
	const [showProducts, setShowProducts] = useState<Array<number>>(
		// Initialize the search products with all the area products
		areaProducts.map((prod) => {
			return prod.id;
		})
	);

	// Drag and drop start event (set active the product)
	const dragStart = (event: any) => {
		const productId = event.active.data.current.externalId;

		const product = areaProducts.find((p) => p.id === productId);

		setActive(product || null);
	};

	// Drag and drop end event (add product to the selecteds array to sell)
	const dragEnd = (event: any) => {
		setActive(null);
		setIsOver(false);

		// Add a new product to the sell list
		if (event.over) {
			const productId = event.active.data.current.externalId;

			addSelectedProduct(productId);
		}
	};

	// Drag and drop over event to se if the product is over the sell form
	const dragOver = (event: any) => {
		if (event.over) {
			setIsOver(true);
		} else {
			setIsOver(false);
		}
	};

	// handle the changes in wich the user incriese the add cant of the product
	const handleAddedProducts = (total: number, productId?: number): void => {
		if (!productId) {
			return;
		}

		added[productId] = total;

		setAdded([...added]);
	};

	// add a product to the sell form
	// add a product to the selected product list

	const addSelectedProduct = (productId: number) => {
		let toAdd = added[productId] ? added[productId] : 0;

		if (selectedElements.length >= MAX_SELECTEDS) {
			return;
		}

		// Check if is aviable && incrise the selected element total
		const alreadySelected = selectedElements.filter(
			(pro) => pro.id == productId
		);

		if (toAdd <= 0) {
			toAdd = 1;
		}

		const aviable =
			areaProducts.find((pro) => pro.id == productId)?.aviable || 0;

		if (aviable === 0) {
			return;
		}

		const trueAviable =
			aviable -
			(alreadySelected?.reduce((acc, item) => {
				return acc + item.added;
			}, 0) || 0);

		if (toAdd > trueAviable) {
			toAdd = trueAviable;
		}

		if (toAdd === 0) {
			return;
		}

		setSelectedElements([
			...selectedElements,
			{
				uuid: crypto.randomUUID(),
				id: productId,
				added: toAdd,
				price: null,
			},
		]);

		handleAddedProducts(0, productId);
	};

	// handle the cuantity of each selected product
	// if the cuantity is 0 the product is deleted from the list
	const handleUpdateSelected = ({
		total,
		uuid,
		price,
	}: SelectedFnParams): void => {
		if (total === undefined) {
			if (price !== undefined) {
				const selected = selectedElements.find((e) => e.uuid === uuid);
				if (selected) {
					selected.price = price;
				}

				setSelectedElements([...selectedElements]);
			}

			return;
		}

		if (total === 0) {
			if (!uuid) {
				setSelectedElements([]);
				return;
			}
			// Eliminate the selected product
			setSelectedElements(selectedElements.filter((e) => e.uuid !== uuid));
		} else {
			const selected = selectedElements.find((e) => e.uuid === uuid);
			if (selected) {
				selected.added = total;
			}

			setSelectedElements([...selectedElements]);
		}
	};

	// handle the search input and set the show products
	const handleSearch = (search: string) => {
		setSearch(search);

		const regex = new RegExp(`${search}`, "i");

		setShowProducts(
			areaProducts
				.filter((apro) => {
					return regex.test(apro.name);
				})
				.map((prod) => {
					return prod.id;
				})
		);
	};

	const { isLoading, execute } = useAction(newSell, {
		onSuccess() {
			toast.success(_("sell_added_successfully"));

			setSelectedElements([]);
			setAdded([]);
		},
		onError(error) {
			toast.error(error);
			setLoading(false);
		},
	});

	const executeSell = ({ id, added }: { id: number; added: number }) => {
		setLoading(id);
		execute({ id: area.id, selecteds: [{ id, added, price: null }] });
	};

	const executeNewSell = (selecteds: SelectedType[]) => {
		setLoading(true);
		execute({ id: area.id, selecteds });
	};

	// An effect for when the user made a sell to update the area products
	useEffect(() => {
		setShowProducts(
			areaProducts.map((prod) => {
				return prod.id;
			})
		);
		setSearch("");
		setLoading(false);
		setAdded([]);
	}, [areaProducts]);

	const disabled = isLoading || loading !== false;

	return (
		<DndContext
			sensors={sensors}
			onDragStart={dragStart}
			onDragOver={dragOver}
			onDragEnd={dragEnd}
		>
			<main className="[grid-area:main] flex flex-col">
				<section>
					<header className="flex flex-col space-y-3 mb-5">
						<div className="flex flex-row items-center justify-between">
							<div className="flex flex-col gap-3">
								<h1 className="text-4xl font-extrabold tracking-tight ">
									{_("sell_area")}
								</h1>

								<p>{_("sell_area_des")}</p>
							</div>
						</div>

						<AreaInfo
							disabled={disabled}
							search={search}
							handleSearch={handleSearch}
							area={area}
						/>
					</header>

					{showProducts.length > 0 ? (
						<>
							<div className="flex flex-col gap-5 w-full">
								{showProducts.map((showProduct) => {
									const product = areaProducts.find(
										(pro) => pro.id === showProduct
									);

									if (!product) {
										return;
									}

									return (
										<ProductDraggableItem
											key={product.id}
											onAdded={(added: number) =>
												handleAddedProducts(added, product.id)
											}
											added={
												product.id && added[product.id] ? added[product.id] : 0
											}
											excecuteSell={executeSell}
											loading={loading !== false && loading === product.id}
											disabled={disabled}
											areaProduct={product}
											addProduct={addSelectedProduct}
										>
											<Draggable id={product.id}>
												<ProductDraggableDetails areaProduct={product} />
											</Draggable>
										</ProductDraggableItem>
									);
								})}
							</div>

							<DragOverlay>
								{active ? (
									<div className="flex flex-row border bg-background rounded-md items-center cursor-grabbing">
										<ProductDraggableDetails
											areaProduct={active}
											added={added[active.id] || 0}
										/>
									</div>
								) : null}
							</DragOverlay>
						</>
					) : (
						<NoResultSearch areaProducts={areaProducts} />
					)}
				</section>
			</main>

			<aside className="[grid-area:aside]">
				{area && (
					<SellForm
						over={isOver}
						areaProducts={areaProducts}
						selecteds={selectedElements}
						onUpdateSelected={handleUpdateSelected}
						loading={loading === true}
						disabled={disabled}
						newSell={executeNewSell}
					/>
				)}
			</aside>
		</DndContext>
	);
}

const NoResultSearch = ({
	areaProducts,
}: {
	areaProducts: ProductsWithPrices[];
}) => {
	const _ = useTranslations("areas");

	return (
		<div className="w-full min-h-[500px] flex justify-center items-center">
			{areaProducts.length > 0 ? (
				<span className="text-xl font-semibold tracking-widest ">
					{_("sell_area_search_no_results")}
				</span>
			) : (
				<div className="flex flex-col items-center justify-center space-y-5">
					<p className="text-xl font-semibold tracking-widest ">
						{_("sell_area_no_products")}
					</p>

					<Link href={`/panel/products`}>
						<Button variant={"secondary"}>{_("add_product")}</Button>
					</Link>
				</div>
			)}
		</div>
	);
};
