"use strict";

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const { expect } = require("chai");

const fs = require("fs");

const rule = require("../../../lib/rules/header");

const { Linter, RuleTester } = require("eslint");

const licenseText = fs.readFileSync(
  __dirname + "/../../fixtures/license-header.js",
  "utf-8"
);
const licensePath = "tests/fixtures/license-header.js";
const licenceWhitespacePath = "tests/fixtures/license-header-whitespace.js";

const invalidLicenseText = licenseText.replace(" Foo Corp.", " Fooooo Corp.");

const licenseTextWin = fs.readFileSync(
  __dirname + "/../../fixtures/license-header-win.js",
  "utf-8"
);
const licensePathWin = "tests/fixtures/license-header-win.js";

const arrayLicense = require("../../fixtures/license-header-array");
const arrayLicenseText = arrayLicense.join("\n");

const validJavascriptCodeModuleText = fs.readFileSync(
  __dirname + "/../../fixtures/javascript-code-module.js",
  "utf-8"
);

const validVueSfcCodeText = fs.readFileSync(
  __dirname + "/../../fixtures/vuejs-sfc-component.vue",
  "utf-8"
);



// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

function getCodeTests(codeText) {
  return {
    valid: [
      {
        code: `${licenseText}\n\n/** do this */\n${codeText}`,
        options: [licensePath],
      },
      {
        code: `${licenseText}\n\n/** do this */\n${codeText}`,
        options: [licenceWhitespacePath],
      },
      {
        code: `${licenseText}\n\n/** do this */\n${codeText}`,
        options: [licensePathWin],
      },
      {
        code: `${licenseText}\r\n\r\n/** do this */\r\n${codeText}`,
        options: [licensePathWin],
      },
      {
        code: `${licenseText}\r\n\r\n/** do this */\r\n${codeText}`,
        options: [licensePath],
      },
      {
        code: `#!/usr/bin/foo\n\n${licenseText}\n\n/** do this */\n${codeText}`,
        options: [licensePath],
      },
      {
        code: `${licenseText}\n\n${codeText}`,
        options: [licensePath],
      },
      {
        code: `${licenseText}\n\n\n\n`,
        options: [licensePath],
      },
      {
        code: `${arrayLicenseText}\n\n${codeText}`,
        options: [arrayLicense],
      },
    ],

    invalid: [
      {
        code: "// HELLO WORLD",
        output: `${licenseText}\n\n// HELLO WORLD`,
        options: [licensePath],
        errors: [
          {
            message: "Missing license header",
            type: "Line",
          },
        ],
      },
      {
        code: "/* HELLO WORLD */",
        output: `${licenseText}\n\n/* HELLO WORLD */`,
        options: [licensePath],
        errors: [
          {
            message: "Missing license header",
            type: "Block",
          },
        ],
      },
      {
        code: "",
        output: `${licenseText}\n\n`,
        options: [licensePath],
        errors: [
          {
            message: "Missing license header",
            type: "Program",
          },
        ],
      },
      {
        code: "\n",
        output: `${licenseText}\n\n`,
        options: [licensePath],
        errors: [
          {
            message: "Missing license header",
            type: "Program",
          },
        ],
      },
      {
        code: "\n\n",
        output: `${licenseText}\n\n`,
        options: [licensePath],
        errors: [
          {
            message: "Missing license header",
            type: "Program",
          },
        ],
      },
      {
        code: `${invalidLicenseText}\n\n${codeText}`,
        output: `${licenseText}\n\n${codeText}`,
        options: [licensePath],
        errors: [
          {
            message: "Invalid license header",
            type: "Block",
          },
        ],
      },
      {
        code: `'use strict';\n\n${codeText}`,
        output: `${licenseText}\n\n'use strict';\n\n${codeText}`,
        options: [licensePath],
        errors: [
          {
            message: "Missing license header",
            type: "ExpressionStatement",
          },
        ],
      },
      {
        code: `/* some comment */\n${codeText}`,
        output: `${licenseText}\n\n/* some comment */\n${codeText}`,
        options: [licensePath],
        errors: [
          {
            message: "Missing license header",
            type: "Block",
          },
        ],
      },
      {
        code: `${codeText}`,
        output: `${licenseText}\n\n${codeText}`,
        options: [licensePath],
        errors: [
          {
            message: "Missing license header",
            type: "ExpressionStatement",
          },
        ],
      },
      {
        code: `\n${codeText}`,
        output: `${licenseText}\n\n${codeText}`,
        options: [licensePath],
        errors: [
          {
            message: "Missing license header",
            type: "ExpressionStatement",
          },
        ],
      },
      {
        code: `${licenseText}\n${codeText}`,
        output: `${licenseText}\n\n${codeText}`,
        options: [licensePath],
        errors: [
          {
            message: "Missing new line after license header",
            type: "Block",
          },
        ],
      },
      {
        code: `${licenseText}\n\n\n${codeText}`,
        output: `${licenseText}\n\n${codeText}`,
        options: [licensePath],
        errors: [
          {
            message: "Superfluous new lines after license header",
            type: "Block",
          },
        ],
      },
      {
        code: `\n${licenseText}\n\n${codeText}`,
        output: `${licenseText}\n\n${codeText}`,
        options: [licensePath],
        errors: [
          {
            message: "Superfluous new lines before license header",
            type: "Block",
          },
        ],
      },
      {
        code: `#!/foo/bar\n${licenseText}\n\n${codeText}`,
        output: `#!/foo/bar\n\n${licenseText}\n\n${codeText}`,
        options: [licensePath],
        errors: [
          {
            message: "Missing new line before license header",
            type: "Block",
          },
        ],
      },
      {
        code: `#!/foo/bar\n\n\n${licenseText}\n\n${codeText}`,
        output: `#!/foo/bar\n\n${licenseText}\n\n${codeText}`,
        options: [licensePath],
        errors: [
          {
            message: "Superfluous new lines before license header",
            type: "Block",
          },
        ],
      },
      {
        code: "'use strict';\r\n\r\nmodule.exports = function() {};",
        output: `${licenseTextWin}\r\n\r\n'use strict';\r\n\r\n${codeText}`,
        options: [licensePath],
        errors: [
          {
            message: "Missing license header",
            type: "ExpressionStatement",
          },
        ],
      },
      {
        code: "#!/foo/bar\n\nmodule.exports = function() {};",
        output: `#!/foo/bar\n\n${licenseText}\n\n${codeText}`,
        options: [licensePath],
        errors: [
          {
            message: "Missing license header",
            type: "Shebang",
          },
        ],
      },
      {
        code: `#!/foo/bar\n\n\n${invalidLicenseText}\n\n${codeText}`,
        output: `#!/foo/bar\n\n\n${licenseText}\n\n${codeText}`,
        options: [licensePath],
        errors: [
          {
            message: "Invalid license header",
            type: "Block",
          },
        ],
      },
      {
        code: `#!/foo/bar\n\n\n${licenseTextWin}\n\n${codeText}`,
        output: `#!/foo/bar\n\n\n${licenseText}\n\n${codeText}`,
        options: [licensePath],
        errors: [
          {
            message: "Invalid license header",
            type: "Block",
          },
        ],
      },
      {
        code: `${invalidLicenseText}\n\n${codeText}`,
        output: `${licenseText}\n\n${codeText}`,
        options: [licenceWhitespacePath],
        errors: [
          {
            message: "Invalid license header",
            type: "Block",
          },
        ],
      },
    ],
  };
};

const ruleTester = new RuleTester();
const javascriptTests = getCodeTests(validJavascriptCodeModuleText);
ruleTester.run("header", rule, javascriptTests);
 
const vueSfcTests = getCodeTests(validVueSfcCodeText);
ruleTester.run("header", rule, vueSfcTests);

describe("header", function () {
  const linter = new Linter();
 
  linter.defineRule("header", rule);

  describe("error handling", function () {
    it("should indicate invalid path option", function () {
      expect(() => {
        linter.verify('exports = "FOO"', {
          rules: {
            header: ["error", "non-existing-path"],
          },
        });
      }).to.throw(/could not read license header from <non-existing-path>/);
    });

    it("should indicate missing path option", function () {
      expect(() => {
        linter.verify('exports = "FOO"', {
          rules: {
            header: ["error"],
          },
        });
      }).to.throw(/missing license header path/);
    });
  });
});
