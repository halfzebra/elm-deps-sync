#!/usr/bin/env node

const fs = require('fs');
const chalk = require('chalk');
const program = require('commander');
const pkg = require('../package.json');
const syncVersions = require('../index').syncVersions;

program
    .version(pkg.version)
    .description('Sync elm-package.json between a parent and a sub')
    .arguments('<parent> <sub>')
    .option('-d, --dry', 'Only print the changes to happen')
    .option('-q, --quiet', 'Will only print the final statement')
    .option('--note', 'Add a `test-dependencies` field to the second file')
    .option('--from <from>', 'Which type of dependencies to sync from: "devDependencies" or "dependencies". Default: "dependencies"')
    .option('--to <to>', 'Which type of dependencies to sync to: "devDependencies" or "dependencies". Default: "dependencies"')
    .option('--skip-missing', 'Only change dependencies present in sub _and_ parent')
    .parse(process.argv);

var files = program.args.slice(0, 2);

if (files.length === 0) {

    var defaultFiles = [ './elm-package.json', './tests/elm-package.json' ];

    if (fs.existsSync(defaultFiles[ 0 ]) && fs.existsSync(defaultFiles[ 1 ])) {
        files = defaultFiles;
    }
}

if (files.length === 2) {
    syncVersions(files[ 0 ], files[ 1 ], program.quiet, program.dry, program.note, program.skipMissing, program.from, program.to);
} else {
    console.log(chalk.yellow('Please specify <parent> file and <sub> file to sync dependencies.'));
    process.exit(1);
}
