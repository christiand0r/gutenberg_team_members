/* eslint-disable no-shadow */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */
import { __ } from '@wordpress/i18n';
import { useEffect, useState, useRef } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { usePrevious } from '@wordpress/compose';
import { isBlobURL, revokeBlobURL } from '@wordpress/blob';
import {
	useBlockProps,
	RichText,
	MediaPlaceholder,
	BlockControls,
	MediaReplaceFlow,
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import {
	Spinner,
	withNotices,
	ToolbarButton,
	Tooltip,
	PanelBody,
	TextControl,
	TextareaControl,
	SelectControl,
	Icon,
} from '@wordpress/components';
import {
	DndContext,
	useSensor,
	useSensors,
	PointerSensor,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';

import { generateID } from '../utils/generators';
import SortableItem from '../components/SorteableItem';

const EMPTY_IMAGE = {
	alt: undefined,
	imagid: undefined,
	url: undefined,
};

function Edit( {
	attributes,
	setAttributes,
	noticeOperations,
	noticeUI,
	isSelected,
} ) {
	const [ blobURL, setBlobURL ] = useState( '' );
	const [ selectedLink, setSelectedLink ] = useState( null );

	const { name, bio, url, alt, imagid, socialLinks } = attributes;

	const titleRef = useRef();
	const dispatch = useDispatch();
	const prevURL = usePrevious( url );
	const prevIsSelected = usePrevious( isSelected );
	const sensors = useSensors(
		useSensor( PointerSensor, {
			activationConstraint: { distance: 5 },
		} )
	);

	const imageObject = useSelect(
		( select ) => select( 'core' ).getMedia( imagid ) || null,
		[ imagid ]
	);

	const { imageSizes } = useSelect(
		( select ) => ( {
			imageSizes: select( blockEditorStore ).getSettings().imageSizes,
		} ),
		[]
	);

	const isSidebarOpened = useSelect(
		( select ) => select( 'core/edit-post' ).isEditorSidebarOpened(),
		[]
	);

	const getImageSizeOptions = () => {
		if ( ! imageObject ) return [];

		const sizes = imageObject.media_details.sizes;
		const options = imageSizes.map( ( { slug, name } ) => {
			const size = sizes[ slug ];
			return { label: name, value: size.source_url };
		} );

		return options;
	};

	const handleURL = ( url ) => {
		noticeOperations.removeAllNotices();
		setAttributes( { alt: '', id: undefined, url } );
	};

	const handleImage = ( img ) => {
		const { alt, id, url } = img;

		noticeOperations.removeAllNotices();

		img?.url
			? setAttributes( { alt, imagid: id, url } )
			: setAttributes( EMPTY_IMAGE );
	};

	const handleUploadError = ( err ) => {
		noticeOperations.removeAllNotices();
		noticeOperations.createErrorNotice( err );

		const timeout = window.setTimeout( () => {
			noticeOperations.removeAllNotices();
			clearTimeout( timeout );
		}, 5000 );
	};

	const handleSelectedLink = ( idx ) => {
		setSelectedLink( idx );

		if ( isSidebarOpened ) return;

		dispatch( 'core/edit-post' ).openGeneralSidebar( 'edit-post/block' );
	};

	const handleRemoveImage = () => {
		setAttributes( EMPTY_IMAGE );
	};

	const handleInfoLink = ( type, value ) => {
		const links = socialLinks.map( ( link ) => {
			return selectedLink !== link.id
				? link
				: { ...link, [ type ]: value };
		} );

		setAttributes( { socialLinks: links } );
	};

	const handleDragEnd = ( e ) => {
		const { active, over } = e;

		if ( active && active.id === over.id ) return;

		const oldIdx = socialLinks.findIndex( ( { id } ) => active.id === id );
		const newIdx = socialLinks.findIndex( ( { id } ) => over.id === id );

		setAttributes( {
			socialLinks: arrayMove( socialLinks, oldIdx, newIdx ),
		} );
	};

	const addNewSocialLink = () => {
		const links = [
			...socialLinks,
			{
				id: generateID(),
				link: 'https://wordpress.com',
				icon: 'wordpress',
			},
		];

		setAttributes( { socialLinks: links } );
		setSelectedLink( socialLinks.length );
	};

	const findSocialLink = () => {
		const link = socialLinks.find( ( link ) => selectedLink === link.id );
		return link || '';
	};

	const removeSocialLink = () => {
		const links = socialLinks.filter( ( { id } ) => selectedLink !== id );
		setAttributes( { socialLinks: links } );
		setSelectedLink( null );
	};

	useEffect( () => {
		! imagid && isBlobURL( url ) && setAttributes( EMPTY_IMAGE );
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [] );

	useEffect( () => {
		if ( isBlobURL( url ) ) setBlobURL( url );

		revokeBlobURL( blobURL );
		setBlobURL( '' );
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ url ] );

	useEffect( () => {
		if ( url && isSelected && ! prevURL ) titleRef.current.focus();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ url, prevURL ] );

	useEffect( () => {
		! isSelected && prevIsSelected && setSelectedLink( null );
	}, [ isSelected, prevIsSelected ] );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Image Settings', 'gutenberg' ) }
					initialOpen={ false }
				>
					{ imagid && (
						<SelectControl
							value={ url }
							label={ __( 'Image Sizes', 'gutenberg' ) }
							options={ getImageSizeOptions() }
							onChange={ ( value ) =>
								setAttributes( { url: value } )
							}
						/>
					) }

					{ url && ! isBlobURL( url ) && (
						<TextareaControl
							value={ alt }
							label={ __( 'Alternative Text', 'gutenberg' ) }
							onChange={ ( value ) =>
								setAttributes( { alt: value } )
							}
							help={ __(
								'The text to describe image',
								'gutenberg'
							) }
						/>
					) }
				</PanelBody>

				{ selectedLink !== null && (
					<PanelBody
						title={ __( 'Social Settings', 'gutenberg' ) }
						initialOpen={ selectedLink !== null }
					>
						<TextControl
							value={ findSocialLink().icon }
							label={ __( 'Social Icon', 'gutenberg' ) }
							onChange={ ( value ) =>
								handleInfoLink( 'icon', value )
							}
						/>
						<TextControl
							value={ findSocialLink().link }
							label={ __( 'Social URL', 'gutenberg' ) }
							onChange={ ( value ) =>
								handleInfoLink( 'link', value )
							}
						/>
					</PanelBody>
				) }
			</InspectorControls>

			{ url && (
				<BlockControls group="inline">
					<Tooltip text={ __( 'Replace Image', 'gutenberg' ) }>
						<div className="wp-block-gutenberg-team-member-replace-img">
							<MediaReplaceFlow
								accept="image/*"
								allowedTypes={ [ 'image' ] }
								onSelect={ handleImage }
								onSelectURL={ handleURL }
								onError={ handleUploadError }
								mediaId={ imagid }
								mediaURL={ url }
								name={ __( 'Replace Image', 'gutenberg' ) }
							/>
						</div>
					</Tooltip>
					<div className="wp-block-gutenberg-team-member-remove-img">
						<ToolbarButton
							onClick={ handleRemoveImage }
							label={ __( 'Remove Image', 'gutenberg' ) }
						/>
					</div>
				</BlockControls>
			) }

			{ selectedLink !== null && (
				<BlockControls group="block">
					<ToolbarButton
						label={ __( 'Remove Social Link', 'gutenberg' ) }
						onClick={ removeSocialLink }
					>
						<Icon icon="editor-unlink" />
					</ToolbarButton>
				</BlockControls>
			) }

			<article { ...useBlockProps() }>
				{ url && (
					<div className="wp-block-gutenberg-team-member-img">
						<img src={ url } alt={ alt }></img>

						{ isBlobURL( url ) && (
							<div className="wp-block-gutenberg-team-member-img-spinner">
								<Spinner />
							</div>
						) }
					</div>
				) }

				<MediaPlaceholder
					icon="format-image"
					accept="image/*"
					allowedTypes={ [ 'image' ] }
					onSelect={ handleImage }
					onSelectURL={ handleURL }
					onError={ handleUploadError }
					disableMediaButtons={ url }
					notices={ noticeUI }
				/>
				<RichText
					tagName="h4"
					value={ name }
					ref={ titleRef }
					placeholder={ __( 'Member name', 'gutenberg' ) }
					onChange={ ( value ) => setAttributes( { name: value } ) }
					allowedFormats={ [] }
				/>
				<RichText
					tagName="p"
					value={ bio }
					placeholder={ __( 'Member biography', 'gutenberg' ) }
					onChange={ ( value ) => setAttributes( { bio: value } ) }
					allowedFormats={ [] }
				/>

				<div className="wp-block-gutenberg-team-member-social-container">
					<ul className="wp-block-gutenberg-team-member-social-links">
						<DndContext
							sensors={ sensors }
							onDragEnd={ handleDragEnd }
							modifiers={ [ restrictToHorizontalAxis ] }
						>
							<SortableContext
								items={ socialLinks.map( ( item ) => item.id ) }
								strategy={ horizontalListSortingStrategy }
							>
								{ socialLinks.map( ( item ) => (
									<SortableItem key={ item.id } item={ item }>
										<li
											className={ `wp-block-gutenberg-team-member-social-link ${
												selectedLink === item.id
													? 'is-selected'
													: ''
											}` }
										>
											<button
												aria-label={ __(
													'Edit social link',
													'gutenberg'
												) }
												onClick={ () =>
													handleSelectedLink(
														item.id
													)
												}
											>
												<Icon icon={ item.icon } />
											</button>
										</li>
									</SortableItem>
								) ) }

								{ isSelected && (
									<li>
										<Tooltip
											text={ __(
												'Add social link',
												'gutenberg'
											) }
										>
											<button
												aria-label={ __(
													'Add social link',
													'gutenberg'
												) }
												className="wp-block-gutenberg-team-member-add-social-link"
												onClick={ addNewSocialLink }
											>
												<Icon icon="plus" />
											</button>
										</Tooltip>
									</li>
								) }
							</SortableContext>
						</DndContext>
					</ul>
				</div>
			</article>
		</>
	);
}

export default withNotices( Edit );
