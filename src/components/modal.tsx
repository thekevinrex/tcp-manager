"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogOverlay,
	DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Modal {
	children: React.ReactNode;
	trigger: React.ReactElement;
	title: string;
	description: string;
	dialogClass?: string;
	open?: boolean;
	openChange?: (open: boolean) => void;
}

export function Modal({
	children,
	trigger,
	title,
	description,
	dialogClass = "sm:max-w-[425px]",
	open,
	openChange,
}: Modal) {
	return (
		<Dialog open={open} onOpenChange={openChange}>
			{trigger}
			<DialogOverlay>
				<DialogContent
					className={cn(["overflow-y-auto max-h-screen", dialogClass])}
				>
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription>{description}</DialogDescription>
					</DialogHeader>
					{children}
				</DialogContent>
			</DialogOverlay>
		</Dialog>
	);
}
