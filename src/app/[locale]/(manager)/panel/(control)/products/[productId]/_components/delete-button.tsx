"use client";
import { Loader2, Trash } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import toast from "react-hot-toast";

import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/dialog";

import { deleteProduct } from "@/actions/products/delete-product";
import { useAction } from "@/hooks/useAction";
import { useRouter } from "next/navigation";

export const DeleteProduct = ({ productId }: { productId: number }) => {
	const _ = useTranslations("products");
	const { push } = useRouter();
	const locale = useLocale();

	const { execute, isLoading: loading } = useAction(deleteProduct, {
		onSuccess: () => {
			toast.success(_("product_deleted_successfully"));
			push(`/${locale}/panel/products`);
		},
		onError: (err) => {
			toast.error(err);
		},
	});

	const handleAction = () => {
		execute({ products: [productId] });
	};

	return (
		<AlertModal
			title={_("product_single_delete_title")}
			description={_("product_single_delete_des")}
			trigger={
				<AlertDialogTrigger asChild>
					<Button variant="destructive" disabled={loading}>
						{loading ? <Loader2 className="animate-spin" /> : <Trash />}
					</Button>
				</AlertDialogTrigger>
			}
			onAction={handleAction}
		/>
	);
};
