/* eslint-disable @wordpress/no-unsafe-wp-apis */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';

import {
	RangeControl,
	PanelBody,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';

import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { cols, separation } = attributes;
	return (
		<>
			<InspectorControls>
				<PanelBody
					initialOpen={ false }
					title={ __( 'Column Settings', 'gutenberg' ) }
				>
					<RangeControl
						min={ 1 }
						max={ 6 }
						value={ cols }
						label={ __( 'Columns', 'gutenberg' ) }
						onChange={ ( value ) =>
							setAttributes( { cols: value } )
						}
					/>
					<UnitControl
						steps={ 1 }
						value={ separation }
						label={ __( 'Separation', 'gutenberg' ) }
						onChange={ ( value ) =>
							setAttributes( { separation: value } )
						}
						help={ __(
							'Set the space between columns',
							'gutenberg'
						) }
					/>
				</PanelBody>
			</InspectorControls>
			<div
				{ ...useBlockProps( {
					style: {
						'--num-cols': `${ cols }`,
						'--separation': `${ separation }`,
					},
				} ) }
			>
				<InnerBlocks
					orientation="horizontal"
					allowedBlocks={ [ 'gutenberg/team-member' ] }
					template={ [
						[ 'gutenberg/team-member' ],
						[ 'gutenberg/team-member' ],
						[ 'gutenberg/team-member' ],
					] }
				/>
			</div>
		</>
	);
}
