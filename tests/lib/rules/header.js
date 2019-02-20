'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const fs = require('fs');

const rule = require('../../../lib/rules/header');

const { RuleTester } = require('eslint');


const licenseText = fs.readFileSync(__dirname + '/../../fixtures/license-header.js', 'utf-8');
const licensePath = 'tests/fixtures/license-header.js';


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
      code: `#!/usr/bin/foo\n\n${licenseText}\n\n/** do this */\nmodule.exports = function() {};`,
      options: [ licensePath ]
    },
    {
      code: `${licenseText}\n\nmodule.exports = function() {};`,
      options: [ licensePath ]
    }
  ],

  invalid: [
    {
      code: '/* some comment */\nmodule.exports = function() {};',
      output: `${licenseText}\n\n/* some comment */\nmodule.exports = function() {};`,
      options: [ licensePath ],
      errors: [
        {
          message: 'Missing license header',
          type: 'Program'
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
          type: 'Program'
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
          type: 'Program'
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
      code: `#!/foo/bar\n\n\n${licenseText}\n\nmodule.exports = function() {};`,
      output: `#!/foo/bar\n\n${licenseText}\n\nmodule.exports = function() {};`,
      options: [ licensePath ],
      errors: [
        {
          message: 'Superfluous new lines before license header',
          type: 'Block'
        }
      ]
    }
  ]
});


const { Linter } = require('eslint');

const linter = new Linter();

linter.defineRule('header', rule);

const results = linter.verifyAndFix('exports = "FOO"', {
  rules: {
    header: [ 'error', licensePath ]
  }
});

console.log(results);

console.log(results.output);