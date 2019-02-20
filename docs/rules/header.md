# Validate the presence of a license header (header)

This rule validates the presence of a license header


## Rule Details

This rule aims to support you by ensuring that all files in your project
have a uniform license header.

Assuming the file `./resources/license-header.js` contains the following contents:

```javascript
/**
 * Copyright (c) Foo Corp.
 *
 * This source code is licensed under the WTFPL license found in the
 * LICENSE file in the root of this projects source tree.
 */
```

Examples of **incorrect** code for this rule:


```js
/** missing header */
module.exports = function hello() {
  return 'hello';
};
```

```js
/**
 * Copyright (c) Foo Corp.
 *
 * This source code is licensed under the WTFPL license found in the
 * LICENSE file in the root of this projects source tree.
 *
 * Modified header, incorrect spacing.
 */
module.exports = function hello() {
  return 'hello';
};
```

Examples of **correct** code for this rule:

```js
/**
 * Copyright (c) Foo Corp.
 *
 * This source code is licensed under the WTFPL license found in the
 * LICENSE file in the root of this projects source tree.
 */

module.exports = function hello() {
  return 'hello';
};
```

### Options

The rule takes one option, the location of the license header template, relative to your `cwd`.

```json
  "license-header/header": [ "error", "./resources/license-header.js" ]
```


## When Not To Use It

If you do not want a unified license header to be present in all your source files.