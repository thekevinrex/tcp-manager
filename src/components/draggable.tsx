import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
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
	const style = {
		transform: CSS.Translate.toString(transform),
	};

	return (
		<div ref={setNodeRef} {...listeners} {...attributes}>
			{children}
		</div>
	);
}
