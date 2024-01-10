import { useDraggable } from "@dnd-kit/core";
import { useMemo } from "react";

export function Draggable({
	id,
	children,
}: {
	id?: number | string;
	children: React.ReactNode;
}) {
	const dragId = useMemo(() => (id ? id : crypto.randomUUID()), [id]);

	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: `draggable-${dragId}`,
		data: {
			externalId: dragId,
		},
	});

	return (
		<div ref={setNodeRef} {...listeners} {...attributes}>
			{children}
		</div>
	);
}
