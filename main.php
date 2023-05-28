<?php

/**
 * Plugin Name:       Boilerplate
 * Description:       Write a description for block
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Boilerplate
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       boilerplate
 *
 * @package           create-block
 */

function create_block_boilerplate_block_init()
{
	register_block_type(__DIR__ . '/build');
}
add_action('init', 'create_block_boilerplate_block_init');
