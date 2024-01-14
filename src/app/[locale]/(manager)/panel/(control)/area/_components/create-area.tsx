"use client";
import { useRouter } from "next/navigation";
import { Loader2, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

import { useAction } from "@/hooks/useAction";
import { createSellArea } from "@/actions/sell-area/create-sell-area";
import { AlertModal } from "@/components/dialog";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { useTranslations } from "next-intl";

export function CreateArea() {
	// Create the state selected products with the already selected area products or with the products with visible state
	const _ = useTranslations("areas");
	const { push } = useRouter();

	const { execute, isLoading: loading } = useAction(createSellArea, {
		onSuccess: () => {
			toast.success(_("area_created_successfully"));
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
			title={_("area_create_title")}
			description={_("area_create_description")}
			trigger={
				<AlertDialogTrigger asChild>
					<Button disabled={loading}>
						{loading ? (
							<Loader2 className="animate-spin" />
						) : (
							<span className="flex gap-x-2">
								<PlusCircle /> {_("area_create_title")}
							</span>
						)}
					</Button>
				</AlertDialogTrigger>
			}
			onAction={handleAction}
		/>
	);
}
