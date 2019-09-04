# Changelog

All notable changes to [eslint-plugin-license-header](https://github.com/nikku/eslint-plugin-license-header) are documented here. We use [semantic versioning](http://semver.org/) for releases.

## Unreleased

___Note:__ Yet to be released changes appear here._

## 0.2.0

* `FEAT`: completely replace whitespace only file contents when adding license
* `FEAT`: report license errors on closed next sibling node (or program)
* `CHORE`: retrieve leading comments in a `eslint@6` compatible way

## 0.1.3

* `FIX`: correct `eslint@5+` error when checking empty files

## 0.1.2

* `FIX`: check and add license using existing line separator ([#1](https://github.com/nikku/eslint-plugin-license-header/issues/1))

## 0.1.1

* `FIX`: correct `rules/header` to properly handle replacement of outdated licenses

## 0.1.0

_Initial implementation._