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
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={onAction}>Continue</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
