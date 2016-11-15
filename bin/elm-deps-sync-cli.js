#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2));
const syncVersions = require('../index').syncVersions;
const chalk = require('chalk');

if (argv._.length === 0) {
    console.log('Sync elm-package.json between a parent and a sub');
    console.log('');
    console.log(chalk.bold('Usage:'));
    console.log('    elm-deps-sync <parent> <sub>');
    console.log('    elm-deps-sync <parent> <sub> [ --quiet --dry --note ]');
    console.log('');
    console.log(chalk.bold('Options:'));
    console.log('    -d, --dry      only print the changes to happen');
    console.log('    -q, --quiet    will only print the final statement');
    console.log('    --note         add a `test-dependencies` field to the second file');
    process.exit(0);
}

var files = argv._.slice(0, 2);

// Flags.
var flags = {
    quiet: argv.quiet || argv.q,
    dry: argv.dry || argv.d,
    note: argv.note
};

if (files.length === 2) {
    syncVersions(files[ 0 ], files[ 1 ], flags.quiet, flags.dry, flags.note);
} else {
    console.log(chalk.yellow('Please specify <parent> file and <sub> file to sync dependencies.'));
    process.exit(1);
}