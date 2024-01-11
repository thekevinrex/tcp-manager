"use client";

import Link from "next/link";
import { Edit2 } from "lucide-react";
import { DndContext, DragOverlay, useSensor, useSensors } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { SellArea, SellAreaProduct } from "@prisma/client";

import { SellAreaProductWithProduct } from "@/lib/types";
import { MouseSensor } from "@/lib/sensors";

import { Button } from "@/components/ui/button";
import { Draggable } from "@/components/draggable";
import { Calculator } from "@/components/calculator";

import Organization from "../_components/organization/organization";

import { ProductDraggableItem } from "./_components/product-draggable-item";
import { SellForm } from "./_components/sell-form";
import { AreaInfo } from "./_components/area-Info";

export type SelectedType = { id: number; added: number; price: number | null };
export type SelectedFnParams = {
	productId?: number;
	total?: number;
	price?: number | null;
};
export type SelectedFn = ({
	productId,
	total,
	price,
}: SelectedFnParams) => void;

export function SellArea({
	area,
	areaProducts,
}: {
	area: SellArea;
	areaProducts: SellAreaProductWithProduct[];
}) {
	// Sensor for the drag and drop
	const sensors = useSensors(useSensor(MouseSensor));

	// The selected products to sell (Important)
	const [selectedElements, setSelectedElements] = useState<SelectedType[]>([]);

	// If a product has incriesed the add cant
	const [added, setAdded] = useState<any[]>([]);

	// The active product bing draged
	const [active, setActive] = useState<SellAreaProductWithProduct | null>(null);

	// If the drag and drop active element is over the sell form
	const [isOver, setIsOver] = useState(false);

	// The search input value
	const [search, setSearch] = useState("");

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

	// add a product to the sell form
	// add a product to the selected product list

	const addSelectedProduct = (productId: number) => {
		let toAdd = added[productId] ? added[productId] : 0;

		// Check if is aviable && incrise the selected element total
		const alreadySelected = selectedElements.find((pro) => pro.id == productId);

		if (toAdd <= 0) {
			toAdd = 1;
		}

		const aviable =
			areaProducts.find((pro) => pro.id == productId)?.aviable || 0;

		if (aviable === 0) {
			return;
		}

		if (alreadySelected) {
			if (toAdd + alreadySelected.added > aviable) {
				toAdd = aviable;
			} else {
				toAdd += alreadySelected.added;
			}

			alreadySelected.added = toAdd;

			setSelectedElements([...selectedElements]);
		} else {
			if (toAdd > aviable) {
				toAdd = aviable;
			}

			setSelectedElements([
				...selectedElements,
				{
					id: productId,
					added: toAdd,
					price: null,
				},
			]);
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

	// handle the cuantity of each selected product
	// if the cuantity is 0 the product is deleted from the list
	const handleUpdateSelected = ({
		total,
		productId,
		price,
	}: SelectedFnParams): void => {
		if (total === undefined) {
			if (price !== undefined) {
				console.log(price);
				const selected = selectedElements.find((e) => e.id === productId);
				if (selected) {
					selected.price = price;
				}

				setSelectedElements([...selectedElements]);
			}

			return;
		}

		if (total === 0) {
			if (!productId) {
				setSelectedElements([]);
				return;
			}
			// Eliminate the selected product
			setSelectedElements(selectedElements.filter((e) => e.id !== productId));
		} else {
			const selected = selectedElements.find((e) => e.id === productId);
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
					return regex.test(apro.product.name);
				})
				.map((prod) => {
					return prod.id;
				})
		);
	};

	// An effect for when the user made a sell to update the area products
	useEffect(() => {
		setShowProducts(
			areaProducts.map((prod) => {
				return prod.id;
			})
		);
		setSearch("");
		setAdded([]);
	}, [areaProducts]);

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
									Sell Area
								</h1>

								<p>The list of all the product ready to sell</p>
							</div>
							<div>
								<Calculator />
							</div>
						</div>

						<AreaInfo search={search} handleSearch={handleSearch} area={area} />
					</header>

					{showProducts.length > 0 ? (
						<>
							<div className="grid grid-cols-12 gap-5">
								{showProducts.map((showProduct) => {
									const product = areaProducts.find(
										(pro) => pro.id === showProduct
									);

									if (!product) {
										return;
									}

									return (
										<div
											key={product.id}
											className="col-span-full sm:col-span-6 md:col-span-4 lg:col-span-3"
										>
											<Draggable id={product.id}>
												<ProductDraggableItem
													onAdded={(added: number) =>
														handleAddedProducts(added, product.id)
													}
													added={
														product.id && added[product.id]
															? added[product.id]
															: 0
													}
													areaProduct={product}
													addProduct={addSelectedProduct}
												/>
											</Draggable>
										</div>
									);
								})}
							</div>

							<DragOverlay>
								{active ? (
									<ProductDraggableItem
										areaProduct={active}
										added={added[active.id] || 0}
									/>
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
						area={area}
					/>
				)}
				<Organization />
			</aside>
		</DndContext>
	);
}

const NoResultSearch = ({
	areaProducts,
}: {
	areaProducts: SellAreaProduct[];
}) => {
	return (
		<div className="w-full min-h-[500px] flex justify-center items-center">
			{areaProducts.length > 0 ? (
				<span className="text-xl font-semibold tracking-widest ">
					No products available to show
				</span>
			) : (
				<div className="flex flex-col items-center justify-center space-y-5">
					<span className="text-xl font-semibold tracking-widest ">
						There are no products aviable in this sell area
					</span>

					<Link href={`/panel/area/edit`}>
						<Button variant={"secondary"}>
							<Edit2 className="mr-2" /> Edit sell area
						</Button>
					</Link>
				</div>
			)}
		</div>
	);
};
