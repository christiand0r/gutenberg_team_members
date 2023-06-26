import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { cols, separation } = attributes;

	return (
		<div
			{ ...useBlockProps.save( {
				style: {
					'--num-cols': `${ cols }`,
					'--separation': `${ separation }`,
				},
			} ) }
		>
			<InnerBlocks.Content />
		</div>
	);
}
