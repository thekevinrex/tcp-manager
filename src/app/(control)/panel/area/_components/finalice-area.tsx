"use client";

import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { AlertModal } from "@/components/dialog";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { SellArea } from "@prisma/client";
import { useAction } from "@/hooks/useAction";
import { finalizeSellArea } from "@/actions/sell-area/finalize-sell-area";
import { useRouter } from "next/navigation";

export function FinalizeArea({ area }: { area: SellArea }) {
	const { push } = useRouter();

	const { execute, isLoading: loading } = useAction(finalizeSellArea, {
		onSuccess: () => {
			toast.success("Area has been finalized successfully");
			push("/panel/area/dashboard");
		},
		onError: (error) => {
			toast.error(error);
		},
	});

	const handleFinalize = () => {
		execute({ id: area.id });
	};

	return (
		<AlertModal
			title="Are you sure you want to finalize the active area?"
			description="If you finalize the area all the information about the active area is going to be archivated until is eliminated, this action can not be undone"
			onAction={handleFinalize}
			trigger={
				<AlertDialogTrigger asChild>
					<Button
						disabled={loading}
						type="button"
						className="flex justify-center w-full"
					>
						{loading ? <Loader2 className="animate-spin" /> : "Finalize"}
					</Button>
				</AlertDialogTrigger>
			}
		/>
	);
}
