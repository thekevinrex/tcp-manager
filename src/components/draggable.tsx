"use client";

import { useDraggable } from "@dnd-kit/core";
import { useEffect, useMemo, useState } from "react";
import { Skeleton } from "./ui/skeleton";

export function Draggable({
	id,
	children,
}: {
	id?: number | string;
	children: React.ReactNode;
}) {
	const dragId = useMemo(() => crypto.randomUUID(), []);
	const [mounted, setMounted] = useState(false);

	const { attributes, listeners, setNodeRef } = useDraggable({
		id: `draggable-${dragId}`,
		data: {
			externalId: id,
		},
	});

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<div>
				<Skeleton className="w-[200px] h-10 ml-4" />
			</div>
		);
	}

	return (
		<div
			ref={setNodeRef}
			className="flex h-full"
			{...listeners}
			{...attributes}
		>
			{children}
		</div>
	);
}
