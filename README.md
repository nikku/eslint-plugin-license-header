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

### Header configuration

Enable the rule in the `rules` section of your configuration file and specify the license header template as a path:

```json
{
  "rules": {
    "license-header/header": [ "error", "./resources/license-header.js" ]
  }
}
```

Alternatively, specify the license header as raw text:

```js
{
  "rules": {
    "license-header/header": [
      "error",
      [
          "/***********************************************",
          " * Copyright My Company",
          " * Copyright " + new Date().getFullYear(),
          "***********************************************/",
      ]
    ]
  }
}
```

### Flat config

In `eslint@9` you can consume the library using a flat configuration, too:

```js
import licenseHeader from "eslint-plugin-license-header";

export default [
  {
    files: '**/*.js',
    plugins: {
      'license-header': licenseHeader
    },
    rules: {
      "license-header/header": ...
    }
  }
];
```

### Autofix

You may [auto-fix](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) your source files, adding or updating a given license header:

```sh
eslint --fix .
```

## Supported rules

* [`license-header/header`](./docs/rules/header.md): checks a source file for the presence of a license header

## License

[MIT](./LICENSE)





