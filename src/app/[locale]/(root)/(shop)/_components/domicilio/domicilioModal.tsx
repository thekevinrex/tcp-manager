"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";

import { Modal } from "@/components/modal";

import { ProductsWithPrices } from "@/lib/types";
import { calcPriceBreakdown, formatCurrency } from "@/lib/utils";

import { DomicilioBody } from "./domicilioBody";
import { SelectedProduct } from "./selected-product";
import { useAction } from "@/hooks/useAction";
import { createDomicilio } from "@/actions/organizations/domicilio/create";
import toast from "react-hot-toast";

export const DomicilioForm = ({
	orgId,
	products,
	productId,
}: {
	orgId: string;
	products: ProductsWithPrices[];
	productId?: number;
}) => {
	const _ = useTranslations("home");

	const [open, setOpen] = useState(false);
	const [selecteds, setSelecteds] = useState<{ id: number; added: number }[]>(
		productId ? [{ id: productId, added: 1 }] : []
	);
	const [total, setTotal] = useState(0);
	const form = useRef<HTMLFormElement>(null);

	const handleSelect = (id: number) => {
		const selected = selecteds.find((s) => s.id === id);
		if (selected) {
			selected.added += 1;

			setSelecteds([...selecteds]);
		} else {
			setSelecteds((prev) => [
				...prev,
				{
					id,
					added: 1,
				},
			]);
		}
	};

	useEffect(() => {
		setTotal(
			selecteds.reduce((acc, curr) => {
				const product = products.find((p) => p.id === curr.id);

				if (!product) {
					return acc;
				}

				return (
					acc +
					curr.added *
						calcPriceBreakdown({
							product,
							total: curr.added,
						})
				);
			}, 0)
		);
	}, [selecteds, products]);

	const { execute, fieldErrors } = useAction(createDomicilio, {
		onSuccess: () => {
			setOpen(false);
			form.current?.reset();
			setSelecteds([]);
			setTotal(0);

			toast.success(_("domicilio_do_success"));
		},
		onError: (error) => {
			toast.error(error);
		},
	});

	const handleSubmit = (formData: FormData) => {
		const address = formData.get("address") as string;
		const phone = formData.get("phone") as string;

		if (!address || !phone) {
			return;
		}

		execute({
			address,
			phone,
			selecteds,
			orgId,
		});
	};

	return (
		<Modal
			open={open}
			openChange={(open) => setOpen(open)}
			trigger={
				<DialogTrigger asChild>
					<Button variant={"secondary"}>{_("domicilio_do")}</Button>
				</DialogTrigger>
			}
			title={_("domicilio_do")}
			description={_("domicilio_do_des")}
		>
			<form action={handleSubmit} ref={form} className="flex flex-col gap-y-5">
				<div className="flex items-center sticky -top-6 bg-background py-3 text-green-600 font-bold px-1 shadow-sm">
					{_("total", { total: formatCurrency(total) })}
				</div>

				<div className="flex flex-col border-y py-3 gap-y-2">
					{selecteds.length > 0 ? (
						selecteds.map((selected) => {
							const product = products.find((p) => p.id === selected.id);

							if (!product) {
								return;
							}

							return (
								<SelectedProduct
									total={selected.added}
									handleAdded={(total) => {
										if (total === 0) {
											setSelecteds((prev) =>
												prev.filter((s) => s.id !== selected.id)
											);
											return;
										}

										selected.added = total;
										setSelecteds([...selecteds]);
									}}
									product={product}
									key={selected.id}
								/>
							);
						})
					) : (
						<p>{_("add_product")}</p>
					)}
				</div>

				<DomicilioBody
					products={products}
					errors={fieldErrors}
					addSelected={handleSelect}
				/>
			</form>
		</Modal>
	);
};
