'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var fs = require('fs');

var rule = require('../../../lib/rules/header');

var RuleTester = require('eslint').RuleTester;


var licenseText = fs.readFileSync(__dirname + '/../../fixtures/license-header.js', 'utf-8');
var licensePath = 'tests/fixtures/license-header.js';

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();

ruleTester.run('header', rule, {

  valid: [
    {
      code: `${licenseText}\n\n/** do this */\nmodule.exports = function() {};`,
      options: [ licensePath ]
    },
    {
      code: `#!/usr/bin/foo\n\n${licenseText}\n\n/** do this */\nmodule.exports = function() {};`,
      options: [ licensePath ]
    }
  ],

  invalid: [
    {
      code: 'module.exports = function() {};',
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
