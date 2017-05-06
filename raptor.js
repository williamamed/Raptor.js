#!/usr/bin/env node
var ctool=require('raptorjs').CommandLine;
var tool = new ctool(__dirname);

/**
var program = tool.getProgram()

// CLI

program
  .option('-s, --social', 'add a human')
  .option('-e, --elevate', 'elevate de plain to the sky')
*/

tool.parse();

/**
if(program.elevate) console.log(program.elevate,program.args)

if(program.social) console.log(program.social,program.args)
*/