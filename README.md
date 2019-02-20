# eslint-plugin-license-header

[![Build Status](https://travis-ci.com/nikku/eslint-plugin-license-header.svg?branch=master)](https://travis-ci.com/nikku/eslint-plugin-license-header)

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

## Supported Rules

* [`license-header/header`](./docs/rules/header.md): checks a source file for the presence of a license header


## License

[MIT](./LICENSE)





