'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const { expect } = require('chai');

const fs = require('fs');

const rule = require('../../../lib/rules/header');

const { Linter, RuleTester } = require('eslint');

const licenseText = fs.readFileSync(__dirname + '/../../fixtures/license-header.js', 'utf-8');
const licensePath = 'tests/fixtures/license-header.js';
const licenceWhitespacePath = 'tests/fixtures/license-header-whitespace.js';

const invalidLicenseText = licenseText.replace(' Foo Corp.', ' Fooooo Corp.');

const licenseTextWin = fs.readFileSync(__dirname + '/../../fixtures/license-header-win.js', 'utf-8');
const licensePathWin = 'tests/fixtures/license-header-win.js';

const arrayLicense = require('../../fixtures/license-header-array');
const arrayLicenseText = arrayLicense.join('\n');

// simple Apache-2.0 SPDX license header
const spdxLicense = [
  '/**',
  ' * @license SPDX-License-Identifier: Apache-2.0',
  ' */'
];

const spdxLicenseText = spdxLicense.join('\n');

const spdxLicenseDoubleSlash = [
  '// SPDX-License-Identifier: Apache-2.0'
]

const spdxLicenseDoubleSlashText = spdxLicenseDoubleSlash.join('\n');

const singleLine = [
  '// Copyright Foobar. All Rights Reserved.'
];

const singleLineText = singleLine.join('\n');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run('header', rule, {

  valid: [
    {
      code: `${licenseText}\n\n/** do this */\nmodule.exports = function() {};`,
      options: [ licensePath ]
    },
    {
      code: `${licenseText}\n\n/** do this */\nmodule.exports = function() {};`,
      options: [ licenceWhitespacePath ]
    },
    {
      code: `${licenseText}\n\n/** do this */\nmodule.exports = function() {};`,
      options: [ licensePathWin ]
    },
    {
      code: `${licenseText}\r\n\r\n/** do this */\r\nmodule.exports = function() {};`,
      options: [ licensePathWin ]
    },
    {
      code: `${licenseText}\r\n\r\n/** do this */\r\nmodule.exports = function() {};`,
      options: [ licensePath ]
    },
    {
      code: `#!/usr/bin/foo\n\n${licenseText}\n\n/** do this */\nmodule.exports = function() {};`,
      options: [ licensePath ]
    },
    {
      code: `${licenseText}\n\nmodule.exports = function() {};`,
      options: [ licensePath ]
    },
    {
      code: `${licenseText}\n\n\n\n`,
      options: [ licensePath ]
    },
    {
      code: `${arrayLicenseText}\n\nmodule.exports = function() {};`,
      options: [ arrayLicense ]
    },
    {
      code: `${spdxLicenseText}\n\nmodule.exports = function() {};`,
      options: [ spdxLicense ]
    },
    {
      code: `${spdxLicenseDoubleSlashText}\n\nmodule.exports = function() {};`,
      options: [ spdxLicenseDoubleSlash ]
    },
    {
      code: `${singleLineText}\n\nmodule.exports = function() {};`,
      options: [ singleLine ]
    }
  ],

  invalid: [
    {
      code: '// HELLO WORLD',
      output: `${licenseText}\n\n// HELLO WORLD`,
      options: [ licensePath ],
      errors: [
        {
          message: 'Missing license header',
          type: 'Line'
        }
      ]
    },
    {
      code: '/* HELLO WORLD */',
      output: `${licenseText}\n\n/* HELLO WORLD */`,
      options: [ licensePath ],
      errors: [
        {
          message: 'Missing license header',
          type: 'Block'
        }
      ]
    },
    {
      code: '',
      output: `${licenseText}\n\n`,
      options: [ licensePath ],
      errors: [
        {
          message: 'Missing license header',
          type: 'Program'
        }
      ]
    },
    {
      code: '\n',
      output: `${licenseText}\n\n`,
      options: [ licensePath ],
      errors: [
        {
          message: 'Missing license header',
          type: 'Program'
        }
      ]
    },
    {
      code: '\n\n',
      output: `${licenseText}\n\n`,
      options: [ licensePath ],
      errors: [
        {
          message: 'Missing license header',
          type: 'Program'
        }
      ]
    },
    {
      code: `${invalidLicenseText}\n\nmodule.exports = function() {};`,
      output: `${licenseText}\n\nmodule.exports = function() {};`,
      options: [ licensePath ],
      errors: [
        {
          message: 'Invalid license header',
          type: 'Block'
        }
      ]
    },
    {
      code: "'use strict';\n\nmodule.exports = function() {};",
      output: `${licenseText}\n\n'use strict';\n\nmodule.exports = function() {};`,
      options: [ licensePath ],
      errors: [
        {
          message: 'Missing license header',
          type: 'ExpressionStatement'
        }
      ]
    },
    {
      code: '/* some comment */\nmodule.exports = function() {};',
      output: `${licenseText}\n\n/* some comment */\nmodule.exports = function() {};`,
      options: [ licensePath ],
      errors: [
        {
          message: 'Missing license header',
          type: 'Block'
        }
      ]
    },
    {
      code: 'module.exports = function() {};',
      output: `${licenseText}\n\nmodule.exports = function() {};`,
      options: [ licensePath ],
      errors: [
        {
          message: 'Missing license header',
          type: 'ExpressionStatement'
        }
      ]
    },
    {
      code: '\nmodule.exports = function() {};',
      output: `${licenseText}\n\nmodule.exports = function() {};`,
      options: [ licensePath ],
      errors: [
        {
          message: 'Missing license header',
          type: 'ExpressionStatement'
        }
      ]
    },
    {
      code: `${licenseText}\nmodule.exports = function() {};`,
      output: `${licenseText}\n\nmodule.exports = function() {};`,
      options: [ licensePath ],
      errors: [
        {
          message: 'Missing new line after license header',
          type: 'Block'
        }
      ]
    },
    {
      code: `${licenseText}\n\n\nmodule.exports = function() {};`,
      output: `${licenseText}\n\nmodule.exports = function() {};`,
      options: [ licensePath ],
      errors: [
        {
          message: 'Superfluous new lines after license header',
          type: 'Block'
        }
      ]
    },
    {
      code: `\n${licenseText}\n\nmodule.exports = function() {};`,
      output: `${licenseText}\n\nmodule.exports = function() {};`,
      options: [ licensePath ],
      errors: [
        {
          message: 'Superfluous new lines before license header',
          type: 'Block'
        }
      ]
    },
    {
      code: `#!/foo/bar\n${licenseText}\n\nmodule.exports = function() {};`,
      output: `#!/foo/bar\n\n${licenseText}\n\nmodule.exports = function() {};`,
      options: [ licensePath ],
      errors: [
        {
          message: 'Missing new line before license header',
          type: 'Block'
        }
      ]
    },
    {
      code: `#!/foo/bar\n\n\n${licenseText}\n\nmodule.exports = function() {};`,
      output: `#!/foo/bar\n\n${licenseText}\n\nmodule.exports = function() {};`,
      options: [ licensePath ],
      errors: [
        {
          message: 'Superfluous new lines before license header',
          type: 'Block'
        }
      ]
    },
    {
      code: "'use strict';\r\n\r\nmodule.exports = function() {};",
      output: `${licenseTextWin}\r\n\r\n'use strict';\r\n\r\nmodule.exports = function() {};`,
      options: [ licensePath ],
      errors: [
        {
          message: 'Missing license header',
          type: 'ExpressionStatement'
        }
      ]
    },
    {
      code: '#!/foo/bar\n\nmodule.exports = function() {};',
      output: `#!/foo/bar\n\n${licenseText}\n\nmodule.exports = function() {};`,
      options: [ licensePath ],
      errors: [
        {
          message: 'Missing license header',
          type: 'Shebang'
        }
      ]
    },
    {
      code: `#!/foo/bar\n\n\n${invalidLicenseText}\n\nmodule.exports = function() {};`,
      output: `#!/foo/bar\n\n\n${licenseText}\n\nmodule.exports = function() {};`,
      options: [ licensePath ],
      errors: [
        {
          message: 'Invalid license header',
          type: 'Block'
        }
      ]
    },
    {
      code: `#!/foo/bar\n\n\n${licenseTextWin}\n\nmodule.exports = function() {};`,
      output: `#!/foo/bar\n\n\n${licenseText}\n\nmodule.exports = function() {};`,
      options: [ licensePath ],
      errors: [
        {
          message: 'Invalid license header',
          type: 'Block'
        }
      ]
    },
    {
      code: `${invalidLicenseText}\n\nmodule.exports = function() {};`,
      output: `${licenseText}\n\nmodule.exports = function() {};`,
      options: [ licenceWhitespacePath ],
      errors: [
        {
          message: 'Invalid license header',
          type: 'Block'
        }
      ]
    }
  ]
});


const vueComponent = fs.readFileSync(__dirname + '/../../fixtures/component.vue', 'utf-8');

const vueRuleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    'sourceType': 'module'
  }
});

vueRuleTester.run('header', rule, {
  valid: [
    {
      code: vueComponent,
      output: vueComponent,
      options: [ licensePath ]
    }
  ],
  invalid: []
});


const svelteComponent = fs.readFileSync(__dirname + '/../../fixtures/component.svelte', 'utf-8');

const svelteRuleTester = new RuleTester({
  parser: require.resolve('svelte-eslint-parser'),
  parserOptions: {
    'sourceType': 'module'
  }
});

svelteRuleTester.run('header', rule, {
  valid: [
    {
      code: svelteComponent,
      output: svelteComponent,
      options: [ licensePath ]
    }
  ],
  invalid: []
});


describe('header', function() {

  const linter = new Linter();

  linter.defineRule('header', rule);


  describe('error handling', function() {

    it('should indicate invalid path option', function() {

      expect(() => {
        linter.verify('exports = "FOO"', {
          rules: {
            header: [ 'error', 'non-existing-path' ]
          }
        });
      }).to.throw(/could not read license header from <non-existing-path>/);

    });


    it('should indicate missing oath option', function() {

      expect(() => {
        linter.verify('exports = "FOO"', {
          rules: {
            header: [ 'error' ]
          }
        });
      }).to.throw(/missing license header path/);

    });

  });

});