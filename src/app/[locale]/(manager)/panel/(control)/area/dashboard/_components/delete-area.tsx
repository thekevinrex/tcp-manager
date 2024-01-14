"use client";

import { Loader2, Trash } from "lucide-react";
import toast from "react-hot-toast";

import { AlertModal } from "@/components/dialog";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { SellArea } from "@prisma/client";
import { useAction } from "@/hooks/useAction";
import { deleteSellArea } from "@/actions/sell-area/delete-sell-area";
import { useTranslations } from "next-intl";

export const DeleteArea = ({ area }: { area: SellArea }) => {
	const _ = useTranslations("areas");
	const { execute, isLoading: loading } = useAction(deleteSellArea, {
		onSuccess: () => {
			toast.success(_("area_deleted_successfully"));
		},
		onError: (error) => {
			toast.error(error);
		},
	});

	const handleDelete = () => {
		execute({ id: area.id });
	};

	return (
		<AlertModal
			title={_("area_delete_title")}
			description={_("area_delete_des")}
			onAction={handleDelete}
			trigger={
				<AlertDialogTrigger asChild>
					<Button disabled={loading} type="button" variant={"destructive"}>
						{loading ? <Loader2 className="animate-spin" /> : <Trash />}
					</Button>
				</AlertDialogTrigger>
			}
		/>
	);
};
