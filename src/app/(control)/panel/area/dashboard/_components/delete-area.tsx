"use client";

import { Loader2, Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { AlertModal } from "@/components/dialog";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { SellArea } from "@prisma/client";
import { useAction } from "@/hooks/useAction";
import { deleteSellArea } from "@/actions/sell-area/delete-sell-area";

export const DeleteArea = ({ area }: { area: SellArea }) => {
	const { execute, isLoading: loading } = useAction(deleteSellArea, {
		onSuccess: () => {
			toast.success("Area deleted successfully");
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
			title="Are you sure you want to delete this area?"
			description="If you delete the area all the information about the area is going to be deleted this include all the sells, this action can not be undone."
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
