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
import { useLocale, useTranslations } from "next-intl";

export function FinalizeArea({
	area,
	disabled,
}: {
	area: SellArea;
	disabled?: boolean;
}) {
	const { push } = useRouter();
	const locale = useLocale();
	const _ = useTranslations("areas");

	const { execute, isLoading: loading } = useAction(finalizeSellArea, {
		onSuccess: () => {
			toast.success(_("area_finalized_successfully"));
			push(`/${locale}/panel/area/dashboard`);
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
			title={_("alert_finalize_title")}
			description={_("alert_finalize_description")}
			onAction={handleFinalize}
			trigger={
				<AlertDialogTrigger asChild>
					<Button
						disabled={loading || disabled}
						type="button"
						className="flex justify-center w-full"
					>
						{loading ? <Loader2 className="animate-spin" /> : _("finalize")}
					</Button>
				</AlertDialogTrigger>
			}
		/>
	);
}
