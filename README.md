# eslint-plugin-license-header

[![Build Status](https://travis-ci.com/nikku/eslint-plugin-license-header.svg?branch=master)](https://travis-ci.com/nikku/eslint-plugin-license-header)

Rules to validate the presence of license headers in your project.


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

* `license-header/header`: ensure that a give license header is present in all your source files


## License

[MIT](./LICENSE)





