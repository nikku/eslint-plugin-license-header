# eslint-plugin-license-header

[![CI](https://github.com/nikku/eslint-plugin-license-header/actions/workflows/CI.yml/badge.svg)](https://github.com/nikku/eslint-plugin-license-header/actions/workflows/CI.yml)
[![Code coverage](https://img.shields.io/codecov/c/github/nikku/eslint-plugin-license-header.svg)](https://codecov.io/gh/nikku/eslint-plugin-license-header)

Rules to validate the presence of license headers in source files.


## Installation

```sh
npm install eslint-plugin-license-header --save-dev
```


## Usage

Add `license-header` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": [
    "license-header"
  ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "license-header/header": [ "error", "./resources/license-header.js" ]
  }
}
```

You may [auto-fix](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) your source files, adding or updating a given license header:

```sh
eslint --fix .
```


## Supported Rules

* [`license-header/header`](./docs/rules/header.md): checks a source file for the presence of a license header


## License

[MIT](./LICENSE)





