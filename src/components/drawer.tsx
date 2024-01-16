import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";

type Props = {
	open?: boolean;
	onChange?: (open: boolean) => void;

	trigger: JSX.Element;
	children: React.ReactNode;
	title: string;
	description: string;
};

export function DrawerBottom({
	trigger,
	title,
	description,
	children,
	open,
	onChange,
}: Props) {
	return (
		<Drawer open={open} onOpenChange={onChange}>
			{trigger}
			<DrawerContent>
				<div className="flex flex-col justify-center items-center p-4 pb-0 space-y-2">
					<DrawerHeader className="flex flex-col justify-start">
						<DrawerTitle>{title}</DrawerTitle>
						<DrawerDescription>{description}</DrawerDescription>
					</DrawerHeader>
					{children}
				</div>
			</DrawerContent>
		</Drawer>
	);
}
