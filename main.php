<?php

/**
 * Plugin Name:       Gutenberg - Team Members
 * Description:       Column layout to show all members of a team
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Christian Door
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       gutenberg
 *
 * @package           gutenberg
 */

function create_block_team_members_init()
{
	register_block_type(__DIR__ . '/build');
}
add_action('init', 'create_block_team_members_init');
