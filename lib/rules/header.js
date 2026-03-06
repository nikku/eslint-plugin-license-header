'use strict';

const fs = require('fs');

const LINEBREAK_MATCHER = /\r\n|[\r\n\u2028\u2029]/u;


// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'Validate the presence of a license header',
      category: 'Possible Errors',
      recommended: true
    },
    fixable: true,
    schema: [
      {
        type: [ 'string', 'array' ],
        items: {
          type: 'string'
        }
      },
      {
        type: 'object',
        properties: {
          allowedHeaderPatterns: {
            type: 'array',
            items: {

              // Note: I wanted to use 'regex' instead of 'object' here.
              type: [ 'object' ]
            }
          },
        },
        additionalProperties: false,
      }
    ]
  },

  create: function(context) {

    const sourceCode = context.sourceCode || context.getSourceCode();

    const newlineChar = getNewlineCharacter(sourceCode);

    const separator = `${newlineChar}${newlineChar}`;

    const {
      licenseHeader: rawHeader,
      allowedHeaderPatterns
    } = parseOptions(context);

    const licenseHeader = replaceNewlines(rawHeader, newlineChar);


    // ----------------------------------------------------------------------
    // Helpers
    // ----------------------------------------------------------------------

    function getNewlineCharacter(sourceCode) {
      const match = LINEBREAK_MATCHER.exec(sourceCode.getText());

      return match && match[0] || '\n';
    }

    function readLicenseFile(path) {

      if (!path) {
        throw new Error('missing license header path');
      }

      try {
        return fs.readFileSync(path, 'utf-8');
      } catch (e) {
        throw new Error(`could not read license header from <${path}>`, {
          cause: e
        });
      }
    }

    function replaceNewlines(text, newlineChar) {
      return text.replace(createGlobalLinebreakMatcher(), newlineChar);
    }

    function parseOptions(context) {

      const {
        options
      } = context;

      const [ pathOrLicense, moreOpts ] = options;

      let licenseHeader;

      if (Array.isArray(pathOrLicense)) {

        // If the path is an array, that means simply use each element as a line for the header
        licenseHeader = pathOrLicense.join('\n');
      } else {
        licenseHeader = readLicenseFile(pathOrLicense).trim();
      }

      // Optional `allowedHeaderPatterns` in second param. If provided, it is an
      // array of license header patterns to accept as valid. Each entry is
      // RegExp to match against the complete license header comment block.
      // If no `allowedHeaderPatterns` are provided, the only valid license
      // header is the `licenseHeader` string from the first param.
      const allowedHeaderPatterns = moreOpts && moreOpts.allowedHeaderPatterns;

      return {
        licenseHeader,
        allowedHeaderPatterns
      };
    }

    function isShebang(node) {
      return node.type === 'Shebang';
    }

    function isLicenseHeader(node) {
      return /(Copyright|@license|SPDX-License-Identifier)\b/i.test(node.value);
    }

    function hasValidText(comment) {
      const text = sourceCode.getText(comment);
      if (allowedHeaderPatterns) {
        for (let pattern of allowedHeaderPatterns) {
          if (typeof pattern === 'string') {
            if (text === pattern) {
              return true;
            }
          } else {
            if (pattern.exec(text)) {
              return true;
            }
          }
        }
        return false;
      } else {
        return text === licenseHeader;
      }
    }

    function getLeadingComments(node) {

      if (node.type === 'Program') {
        return sourceCode.getCommentsInside(node);
      } else {
        return sourceCode.getCommentsBefore(node);
      }
    }

    function findLicenseComment(comments) {

      return comments.reduce(function(found, comment) {

        if (found !== null) {
          return found;
        }

        if (isLicenseHeader(comment)) {
          return comment;
        }

        // continue searching, if shebang is found
        return isShebang(comment) ? null : false;
      }, null);
    }

    // ----------------------------------------------------------------------
    // Public
    // ----------------------------------------------------------------------

    return {
      Program: function(programNode) {

        // ignore Vue SFC
        if (programNode.templateBody) {
          return;
        }

        const firstStatement = programNode.body[0];

        // ignore Svelte SFC
        if (/^Svelte*/.test(firstStatement && firstStatement.type)) {
          return;
        }

        const comments = getLeadingComments(firstStatement || programNode);

        const licenseNode = findLicenseComment(comments);

        if (licenseNode) {
          if (!hasValidText(licenseNode)) {
            return context.report({
              node: licenseNode,
              message: 'Invalid license header',
              fix: function(fixer) {
                return fixer.replaceText(licenseNode, licenseHeader);
              }
            });
          }

          const previousSibling = comments[comments.indexOf(licenseNode) - 1];

          const nextSibling = comments[comments.indexOf(licenseNode) + 1] || firstStatement;

          if (nextSibling) {
            const lLocEnd = licenseNode.loc.end.line;
            const nLocStart = nextSibling.loc.start.line;

            const fix = function(fixer) {
              return fixer.replaceTextRange(
                [ licenseNode.range[1], nextSibling.range[0] ],
                separator
              );
            };

            if (nLocStart - lLocEnd > 2) {
              context.report({
                node: licenseNode,
                loc: licenseNode.loc.end,
                message: 'Superfluous new lines after license header',
                fix
              });
            }

            if (nLocStart - lLocEnd < 2) {
              context.report({
                node: licenseNode,
                loc: licenseNode.loc.end,
                message: 'Missing new line after license header',
                fix
              });
            }
          }


          if (previousSibling) {
            const lLocStart = licenseNode.loc.start.line;
            const nLocEnd = previousSibling.loc.end.line;

            const fix = function(fixer) {
              return fixer.replaceTextRange(
                [ previousSibling.range[1], licenseNode.range[0] ],
                separator
              );
            };

            if (lLocStart - nLocEnd > 2) {
              context.report({
                node: licenseNode,
                loc: licenseNode.loc.start,
                message: 'Superfluous new lines before license header',
                fix
              });
            }

            if (lLocStart - nLocEnd < 2) {
              context.report({
                node: licenseNode,
                loc: licenseNode.loc.start,
                message: 'Missing new line before license header',
                fix
              });
            }
          } else {
            const lLocStart = licenseNode.loc.start.line;

            if (lLocStart !== 1) {
              context.report({
                node: licenseNode,
                loc: licenseNode.loc.start,
                message: 'Superfluous new lines before license header',
                fix: function(fixer) {
                  return fixer.replaceTextRange([ 0, licenseNode.range[0] ], '');
                }
              });
            }
          }
        } else {
          const shebang = comments.find(isShebang);

          context.report({
            node: shebang || comments[0] || firstStatement || programNode,
            message: 'Missing license header',
            fix: function(fixer) {
              if (shebang) {
                return fixer.insertTextAfter(
                  shebang,
                  `${separator}${licenseHeader}`
                );
              } else {

                const beforeNode = comments[0] || firstStatement;

                const endRange = beforeNode ? beforeNode.range[0] : programNode.range[1];

                return fixer.replaceTextRange(
                  [ 0, endRange ],
                  `${licenseHeader}${separator}`
                );
              }
            }
          });
        }
      }
    };
  }
};


// helpers /////////////////////

/**
 * Creates a version of the LINEBREAK_MATCHER regex with the global flag.
 * Global regexes are mutable, so this needs to be a function instead of a constant.
 * @returns {RegExp} A global regular expression that matches line terminators
 */
function createGlobalLinebreakMatcher() {
  return new RegExp(LINEBREAK_MATCHER.source, 'gu');
}
