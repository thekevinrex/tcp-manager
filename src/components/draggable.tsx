import { useDraggable } from "@dnd-kit/core";
import { useMemo } from "react";

export function Draggable({
	id,
	children,
}: {
	id?: number | string;
	children: React.ReactNode;
}) {
	const dragId = useMemo(() => crypto.randomUUID(), []);

	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: `draggable-${dragId}`,
		data: {
			externalId: id,
		},
	});

	return (
		<div ref={setNodeRef} {...listeners} {...attributes}>
			{children}
		</div>
	);
}
