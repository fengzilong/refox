#!/usr/bin/env node
'use strict';

const updateNotifier = require( 'update-notifier' );
const resolveCwd = require( 'resolve-cwd' );
const program = require( 'commander' );
const refox = require( '../refox' );
const pkg = require( '../package.json' );

const DEFAULT_CONFIG_FILENAME = 'refox.config.js';

updateNotifier( { pkg: pkg } ).notify();

program
	.version( pkg.version )
	.description( 'lightweight mock server on top of koa' )
	.option( '-c, --config <path>', 'specify config file path' )
	.option( '-d, --debug', 'enable debug mode' )
	.parse( process.argv );

const configFilename = program.config || DEFAULT_CONFIG_FILENAME;
const configPath = resolveCwd( './' + configFilename );

if ( !configPath ) {
	throw new Error( configFilename + ` not found` );
}

const config = require( configPath );

refox( config, function ( err ) {
	if ( err ) {
		return;
	}
	console.log( 'Listening on port:' + ( config.port || 6000 ) );
} );
