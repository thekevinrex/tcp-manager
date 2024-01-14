"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslations } from "next-intl";

interface Dialog {
	trigger: React.ReactElement;
	title: string;
	description: string;
	open?: boolean;
	onOpenChange?: (show: boolean) => void;
	onAction: () => void;
}

export function AlertModal({
	trigger,
	title,
	description,
	open,
	onOpenChange,
	onAction,
}: Dialog) {
	const _ = useTranslations("alert");

	return (
		<AlertDialog
			open={open ? open : undefined}
			onOpenChange={onOpenChange ? onOpenChange : undefined}
		>
			{trigger}
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>{_("cancel")}</AlertDialogCancel>
					<AlertDialogAction onClick={onAction}>
						{_("continue")}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
