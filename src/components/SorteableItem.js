import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function SortableItem( { item, children } ) {
	const { attributes, listeners, transform, transition, setNodeRef } =
		useSortable( { id: item.id } );

	const style = {
		transition,
		transform: CSS.Transform.toString( transform ),
	};

	return (
		<div
			style={ style }
			ref={ setNodeRef }
			{ ...attributes }
			{ ...listeners }
		>
			{ children }
		</div>
	);
}
