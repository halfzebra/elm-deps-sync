const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const syncVersions = require('../index').syncVersions;
const expect = require('chai').expect;
const extend = require('extend');

const TEST_DATA_FOLDER = 'data';
const SPEC_FOLDER = 'tests';
const PKG_FILENAME = 'elm-package.json';

const TOP_PATH = path.resolve(TEST_DATA_FOLDER, PKG_FILENAME);
const SPEC_PATH = path.resolve(TEST_DATA_FOLDER, SPEC_FOLDER, PKG_FILENAME);

describe('Test dependency sync', function () {
    before(function () {

        var packageSkeleton = {
            'version': '1.0.0',
            'summary': 'test elm deps sync',
            'repository': 'https://github.com/NoRedInk/elm-ops-tooling',
            'license': 'BSD-3',
            'source-directories': '.',
            'exposed-modules': [],
            'native-modules': true,
            'dependencies': {},
            'elm-version': '0.17.0 <= v <= 0.17.0'
        };

        var topLevelDeps = {
            'elm-community/top-1': '1.0.0 <= v <= 1.0.0',
            'elm-community/top-2': '1.0.0 <= v <= 1.0.0',
            'elm-community/top-3': '1.0.0 <= v <= 1.0.0'
        };

        var specDeps = {
            'elm-community/top-1': '1.0.0 <= v <= 1.0.0',
            'elm-community/top-2': '1.0.0 <= v <= 1.0.0',
            'elm-community/spec-1': '1.0.0 <= v <= 1.0.0',
            'elm-community/spec-2': '1.0.0 <= v <= 1.0.0'
        };

        var topLevelPkg = makePackage(packageSkeleton, topLevelDeps);
        var specDepsPkg = makePackage(packageSkeleton, specDeps);

        fs.mkdirSync(TEST_DATA_FOLDER);
        fs.mkdirSync('./data/tests');

        fs.writeFileSync(TOP_PATH, JSON.stringify(topLevelPkg, null, 2));
        fs.writeFileSync(SPEC_PATH, JSON.stringify(specDepsPkg, null, 2));
    });

    after(function () {

        rimraf.sync(TEST_DATA_FOLDER);
    });

    it('Should have synced list of dependencies', function () {

        syncVersions(TOP_PATH, SPEC_PATH, true);

        var specPkg = JSON.parse(fs.readFileSync(SPEC_PATH));

        expect(specPkg.dependencies).to.be.deep.equal({
            'elm-community/spec-1': '1.0.0 <= v <= 1.0.0',
            'elm-community/spec-2': '1.0.0 <= v <= 1.0.0',
            'elm-community/top-1': '1.0.0 <= v <= 1.0.0',
            'elm-community/top-2': '1.0.0 <= v <= 1.0.0',
            'elm-community/top-3': '1.0.0 <= v <= 1.0.0'
        });
    });

    it('Should have a correct list of `test-dependencies` in spec elm-package.json', function () {

        syncVersions(TOP_PATH, SPEC_PATH, true, false, true);

        var specPkg = JSON.parse(fs.readFileSync(SPEC_PATH));

        expect(specPkg[ 'test-dependencies' ]).to.be.deep.equal({
            'elm-community/spec-1': '1.0.0 <= v <= 1.0.0',
            'elm-community/spec-2': '1.0.0 <= v <= 1.0.0'
        });
    });
});

function makePackage(skeleton, deps) {

    return extend({}, skeleton, { dependencies: deps });
}

