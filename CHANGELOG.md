# Changelog

All notable changes to [eslint-plugin-license-header](https://github.com/nikku/eslint-plugin-license-header) are documented here. We use [semantic versioning](http://semver.org/) for releases.

## Unreleased

___Note:__ Yet to be released changes appear here._

## 0.7.0

* `FEAT`: recognize `@license` annotated headers ([#19](https://github.com/nikku/eslint-plugin-license-header/issues/19))

## 0.6.1

* `FIX`: play nicely with Svelte and Vue components ([#16](https://github.com/nikku/eslint-plugin-license-header/pull/16), [#6](https://github.com/nikku/eslint-plugin-license-header/issue/6))

## 0.6.0

* `FEAT`: make ESLint@8 compatible

## 0.5.0

* `FEAT`: add ability to provide header via configuration ([#11](https://github.com/nikku/eslint-plugin-license-header/pull/11))

## 0.4.0

* `FEAT`: trim newline around parsed license ([#8](https://github.com/nikku/eslint-plugin-license-header/issues/8))

## 0.3.0

* `FEAT`: mark rule as `type=layout` ([#7](https://github.com/nikku/eslint-plugin-license-header/pull/7))

## 0.2.1

* `CHORE`: limit amout of published files

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