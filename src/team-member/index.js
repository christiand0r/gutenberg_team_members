import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

import Edit from './edit';
import save from './save';

registerBlockType( 'gutenberg/team-member', {
	title: __( 'Team Member', 'gutenberg' ),
	description: __( 'Card to represent a member of a team', 'gutenberg' ),
	icon: 'admin-users',
	keywords: [ 'member', 'item', 'team' ],
	textdomain: 'gutenberg',
	parent: [ 'gutenberg/team-members' ],
	supports: {
		html: false,
		reusable: false,
	},
	attributes: {
		name: {
			type: 'string',
			source: 'html',
			selector: 'h4',
		},
		bio: {
			type: 'string',
			source: 'html',
			selector: 'p',
		},
		imagid: {
			type: 'number',
		},
		alt: {
			type: 'string',
			source: 'attribute',
			selector: 'img',
			attribute: 'alt',
			default: '',
		},
		url: {
			type: 'string',
			source: 'attribute',
			selector: 'img',
			attribute: 'src',
		},
		socialLinks: {
			type: 'array',
			default: [],
			source: 'query',
			selector: 'li.wp-block-gutenberg-team-member-social-link',
			query: {
				id: {
					source: 'attribute',
					attribute: 'id',
				},
				icon: {
					source: 'attribute',
					attribute: 'data-icon',
				},
				link: {
					source: 'attribute',
					selector: 'a',
					attribute: 'href',
				},
			},
		},
	},
	edit: Edit,
	save,
} );
