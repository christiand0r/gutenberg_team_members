import { registerBlockType, createBlock } from '@wordpress/blocks';
import './style.scss';

import Edit from './edit';
import save from './save';
import metadata from './block.json';

// @Blocks
import './team-member';

registerBlockType( metadata.name, {
	edit: Edit,
	save,
	transforms: {
		from: [
			{
				type: 'block',
				blocks: [ 'core/gallery' ],
				transform: ( { images, columns } ) => {
					const innerBlocks = images.map( ( { url, alt, id } ) =>
						createBlock( 'gutenberg/team-member', {
							url,
							alt,
							imagid: id,
						} )
					);

					return createBlock(
						'gutenberg/team-members',
						{ cols: columns || 2 },
						innerBlocks
					);
				},
			},
			{
				type: 'block',
				blocks: [ 'core/image' ],
				isMultiBlock: true,
				transform: ( attributes ) => {
					const innerBlocks = attributes.map( ( { url, alt, id } ) =>
						createBlock( 'gutenberg/team-member', {
							url,
							alt,
							imagid: id,
						} )
					);

					return createBlock(
						'gutenberg/team-members',
						{ cols: attributes.length > 3 ? 3 : attributes.length },
						innerBlocks
					);
				},
			},
		],
	},
} );
