#!/usr/bin/env node
'use strict';

const path = require( 'path' );
const debug = require( 'debug' )( 'refox' );
const updateNotifier = require( 'update-notifier' );
const resolveCwd = require( 'resolve-cwd' );
const yargs = require( 'yargs' );
const refox = require( './refox' );
const pkg = require('./package.json');

const DEFAULT_CONFIG_FILENAME = 'refox.config.js';
let CONFIG_FILENAME = DEFAULT_CONFIG_FILENAME;

updateNotifier( { pkg: pkg } ).notify();

const configPath = resolveCwd( './' + DEFAULT_CONFIG_FILENAME );

if( !configPath ) {
	debug( `%s not found`, configPath );
	return;
}

const config = require( configPath );

refox( config, function( err ) {
	if( err ) {
		return;
	}
	console.log( 'listening on port:' + ( config.port || 6000 ) );
} );
