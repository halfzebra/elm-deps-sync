## elm-deps-sync

[![npm version](https://badge.fury.io/js/elm-deps-sync.svg)](https://badge.fury.io/js/elm-deps-sync) [![Build Status](https://travis-ci.org/halfzebra/elm-deps-sync.svg?branch=master)](https://travis-ci.org/halfzebra/elm-deps-sync)

Node.js port of [NoRedInk/elm-ops-tooling/elm_deps_sync](https://github.com/NoRedInk/elm-ops-tooling#elm_deps_sync)

Sometimes we want to sync the deps between two files, such that all the deps in one file are matched in another file.
The deps in the first file will be added to the deps in the second file. Note that this is additive.

Usage:

- `--dry` will only print the changes to happen, not write them to file
- `--quiet` will only print the final statement
- `--note` will add a `test-dependencies` field to the second file. Useful for tooling
- `--skip-missing` will skip dependencies not present in the second file and only update what is present in both
- `--from` which type of dependency list to sync from: "devDependencies" or "dependencies". Default: "dependencies"
- `--to` which type of dependency list to sync to: "devDependencies" or "dependencies". Default: "dependencies"

```bash
elm-deps-sync elm-package.json spec/elm/elm-package.json
```

will print

```
1 packages changed.
Package mgold/elm-date-format inserted to spec/elm/elm-package.json for the first time at version "1.1.2 <= v < 2.0.0"
```
