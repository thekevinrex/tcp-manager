"use client";
import { useRouter } from "next/navigation";
import { Loader2, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

import { useAction } from "@/hooks/useAction";
import { createSellArea } from "@/actions/sell-area/create-sell-area";
import { AlertModal } from "@/components/dialog";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";

export function CreateArea() {
	// Create the state selected products with the already selected area products or with the products with visible state

	const { push } = useRouter();

	const { execute, isLoading: loading } = useAction(createSellArea, {
		onSuccess: () => {
			toast.success("Sell area created successfully");
			push(`/panel/sell-area`);
		},
		onError: (error) => {
			toast.error(error);
		},
	});

	const handleAction = () => {
		execute({});
	};

	return (
		<AlertModal
			title={"Create sell area"}
			description="Are you sure you want to create a new sell area"
			trigger={
				<AlertDialogTrigger asChild>
					<Button disabled={loading}>
						{loading ? (
							<Loader2 className="animate-spin" />
						) : (
							<span className="flex gap-x-2">
								<PlusCircle /> Create sell area
							</span>
						)}
					</Button>
				</AlertDialogTrigger>
			}
			onAction={handleAction}
		/>
	);
}
