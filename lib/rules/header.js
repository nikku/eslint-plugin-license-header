'use strict';

const fs = require('fs');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Validate the presence of a license header',
      category: 'Possible Errors',
      recommended: true
    },
    fixable: true,
    schema: [
      {
        type: 'string'
      }
    ]
  },

  create: function(context) {

    const {
      licenseComment
    } = parseOptions(context);


    // ----------------------------------------------------------------------
    // Helpers
    // ----------------------------------------------------------------------

    function parseOptions(context) {

      const {
        options
      } = context;

      const [ path ] = options;

      const header = fs.readFileSync(path, 'utf-8');

      return {
        licenseComment: header.replace(/^\s*\/(?:\*|\/)|\*\/\s*$/g, ''),
        type: /^\s*\/\//.test(header) ? 'block' : 'inline'
      };
    }

    function isShebang(node) {
      return node.type === 'Shebang';
    }

    function isLicenseHeader(node) {
      return node.value.includes('Copyright ');
    }

    function hasValidText(comment) {
      return comment.value === licenseComment;
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
      Program: function(node) {

        const body = node.body[0];

        const comments = context.getCommentsBefore(body);

        const licenseNode = findLicenseComment(comments);

        if (licenseNode) {
          if (!hasValidText(licenseNode)) {
            context.report({
              node: licenseNode,
              message: 'Invalid license header',
              fix: function(fixer) {
                return fixer.replaceText(licenseNode, licenseComment);
              }
            });
          }

          const previousSibling = comments[comments.indexOf(licenseNode) - 1];

          const nextSibling = comments[comments.indexOf(licenseNode) + 1] || body;

          if (nextSibling) {
            const lLocEnd = licenseNode.loc.end.line;
            const nLocStart = nextSibling.loc.start.line;

            const fix = function(fixer) {
              return fixer.replaceTextRange([licenseNode.range[1], nextSibling.range[0]], '\n\n');
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
              return fixer.replaceTextRange([previousSibling.range[1], licenseNode.range[0]], '\n\n');
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
                  return fixer.replaceTextRange([0, licenseNode.range[0]], '');
                }
              });
            }
          }
        } else {
          const shebang = comments.find(isShebang);

          context.report({
            node,
            message: 'Missing license header',
            fix: function(fixer) {
              if (shebang) {
                return fixer.insertTextAfter(shebang, `\n\n/*${licenseComment}*/`);
              } else {
                return fixer.replaceTextRange([0, (comments[0] || node).range[0] ], `/*${licenseComment}*/\n\n`);
              }
            }
          });
        }
      }
    };
  }
};
