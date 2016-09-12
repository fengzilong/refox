#!/usr/bin/env node
'use strict';

const path = require( 'path' );
const debug = require( 'debug' )( 'refox' );
const updateNotifier = require( 'update-notifier' );
const resolveCwd = require( 'resolve-cwd' );
const program = require( 'commander' );
const refox = require( '../refox' );
const pkg = require('../package.json');

const DEFAULT_CONFIG_FILENAME = 'refox.config.js';

updateNotifier( { pkg: pkg } ).notify();

// workaround for -v support
// https://github.com/tj/commander.js/issues/560
(function() {
	var pos = process.argv.indexOf( '-v' );
	if ( pos > -1 ) {
		process.argv[pos] = '-V';
	}
})();

program
	.version( pkg.version )
	.description( 'lightweight mock server on top of koa' )
	.option( '-c, --config <path>', 'specify config file path' )
	.option( '-d, --debug', 'enable debug mode' )
	// parse
	.parse( process.argv );

const configFilename = program.config ?
		program.config : DEFAULT_CONFIG_FILENAME;
const configPath = resolveCwd( './' + configFilename );

if( !configPath ) {
	throw new Error( configFilename + ` is not found` );
}

const config = require( configPath );

refox( config, function( err ) {
	if( err ) {
		return;
	}
	console.log( 'listening on port:' + ( config.port || 6000 ) );
} );
