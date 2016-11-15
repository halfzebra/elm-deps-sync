const fs = require('fs');
const extend = require('extend');

function syncVersions(topLevelFilePath, specFilePath, quiet, dry, noteTestDeps) {

    if (typeof quiet === 'undefined') {
        quiet = false;
    }

    if (typeof dry === 'undefined') {
        dry = false;
    }

    if (typeof noteTestDeps === 'undefined') {
        noteTestDeps = false;
    }

    var topLevelFileContent = fs.readFileSync(topLevelFilePath);
    var specFileContent = fs.readFileSync(specFilePath);

    var topLevelPkg = JSON.parse(topLevelFileContent);
    var specPkg = JSON.parse(specFileContent);

    var topLevelDeps = topLevelPkg.dependencies;
    var specDeps = specPkg.dependencies;

    var topLevelDepNames = Object.keys(topLevelDeps).sort();
    var specDepNames = Object.keys(specDeps).sort();

    var messages = [];

    // Package names present only in top level elm-package.json
    var missingFromSpecNames = topLevelDepNames.filter(function (name) {
        return specDepNames.indexOf(name) === -1;
    });

    // Test dependencies present only in spec elm-package.json
    var specOnlyDepNames = specDepNames.filter(function (name) {
        return topLevelDepNames.indexOf(name) === -1;
    });

    var newSpecDepNames = [].concat(specDepNames, missingFromSpecNames).sort();

    var newSpecPkg = extend({}, specPkg, { dependencies: {} });

    var newSpecPkgDeps = {};

    newSpecDepNames.forEach(function (name) {

        if (missingFromSpecNames.indexOf(name) !== -1) {

            messages.push(
                'Package `' + name + '` inserted to `' + specFilePath + '` for the first time at version "' +
                topLevelDeps[ name ] + '"'
            );

            newSpecPkgDeps[ name ] = topLevelDeps[ name ];
        }

        if (specDepNames.indexOf(name) !== -1 && topLevelDepNames.indexOf(name) !== -1) {
            if (specDeps[ name ] !== topLevelDeps[ name ]) {

                messages.push('Changing ' + name + ' from version ' + specDeps[ name ] + ' to ' + topLevelDeps[ name ]);
            }

            newSpecPkgDeps[ name ] = topLevelDeps[ name ];
        }

        if (specOnlyDepNames.indexOf(name) !== -1) {
            newSpecPkgDeps[ name ] = specDeps[ name ];
        }
    });

    newSpecPkg = extend({}, newSpecPkg, { dependencies: newSpecPkgDeps });

    if (noteTestDeps === true && dry === false) {

        // Add a separate key to spec elm-package.json with spec-specific packages.
        newSpecPkg = addTestDeps(specOnlyDepNames, specDeps, newSpecPkg);
    }

    if (messages.length > 0 || noteTestDeps === true) {

        if (dry === false) {

            // Write new spec elm-package.json
            fs.writeFileSync(specFilePath, JSON.stringify(newSpecPkg, null, 2));

            console.log(messages.length + ' packages changed.');
        } else {

            console.log('No changes written.');
        }

        if (quiet === false) {

            messages.forEach(function (message) {

                console.log(message);
            });
        }
    } else {

        console.log('No changes needed.');
    }
}

function addTestDeps(specOnlyDepNames, specDeps, specPkg) {
    var testDependencies = {};

    specOnlyDepNames.forEach(function (name) {
        testDependencies[ name ] = specDeps[ name ];
    });

    return extend({}, specPkg, { 'test-dependencies': testDependencies });
}

module.exports = {
    syncVersions: syncVersions
};