import { useBlockProps, RichText } from '@wordpress/block-editor';
import { Icon } from '@wordpress/components';

export default function save( { attributes } ) {
	const { name, bio, url, alt, imagid, socialLinks } = attributes;

	return (
		<article { ...useBlockProps.save() }>
			{ url && (
				<img
					src={ url }
					alt={ alt }
					className={ imagid ? `wp-image-${ imagid }` : null }
				/>
			) }
			{ name && <RichText.Content tagName="h4" value={ name } /> }
			{ bio && <RichText.Content tagName="p" value={ bio } /> }

			{ socialLinks.length && (
				<div className="wp-block-gutenberg-team-member-social-container">
					<ul className="wp-block-gutenberg-team-member-social-links">
						{ socialLinks.map( ( item ) => (
							<li
								key={ item.id }
								id={ item.id }
								data-icon={ item.icon }
								className="wp-block-gutenberg-team-member-social-link"
							>
								<a
									href={ item.link }
									target="_blank"
									rel="noopener noreferrer"
								>
									<Icon icon={ item.icon } />
								</a>
							</li>
						) ) }
					</ul>
				</div>
			) }
		</article>
	);
}
