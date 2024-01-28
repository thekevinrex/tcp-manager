"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DataType } from "@/lib/types";

export function Combobox({
	data,
	onSelect,
	trigger,
	empty,
	search,
	modal = false,
}: {
	data: DataType[];
	onSelect?: (selected: string) => void;
	trigger: JSX.Element;
	empty?: string;
	search?: string;
	modal?: boolean;
}) {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState("");

	return (
		<Popover open={open} onOpenChange={setOpen} modal={modal}>
			<PopoverTrigger asChild>{trigger}</PopoverTrigger>
			<PopoverContent className="w-full p-0">
				<Command>
					<CommandInput placeholder={search} />
					<CommandList>
						<CommandEmpty>{empty}</CommandEmpty>
						<CommandGroup>
							{data.map((framework) => (
								<CommandItem
									key={framework.value}
									value={framework.label}
									onSelect={(currentValue) => {
										setValue(currentValue === value ? "" : currentValue);

										if (onSelect) {
											onSelect(framework.value);
										}
										setOpen(false);
									}}
								>
									<Check
										className={cn(
											"mr-2 h-4 w-4",
											value === framework.value ? "opacity-100" : "opacity-0"
										)}
									/>
									{framework.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
