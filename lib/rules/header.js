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

      return {
        licenseComment: fs.readFileSync(path, 'utf-8').replace(/^\s*\/(?:\*|\/)|\*\/\s*$/g, '')
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

        const licenseComment = findLicenseComment(comments);

        if (licenseComment) {
          if (!hasValidText(licenseComment)) {
            context.report({
              node: licenseComment,
              message: 'Invalid license header'
            });
          }

          const previousSibling = comments[comments.indexOf(licenseComment) - 1];

          const nextSibling = comments[comments.indexOf(licenseComment) + 1] || body;

          if (nextSibling) {
            const lLocEnd = licenseComment.loc.end.line;
            const nLocStart = nextSibling.loc.start.line;

            if (nLocStart - lLocEnd > 2) {
              context.report({
                node: licenseComment,
                loc: licenseComment.loc.end,
                message: 'Superfluous new lines after license header'
              });
            }

            if (nLocStart - lLocEnd < 2) {
              context.report({
                node: licenseComment,
                loc: licenseComment.loc.end,
                message: 'Missing new line after license header'
              });
            }
          }


          if (previousSibling) {
            const lLocStart = licenseComment.loc.start.line;
            const nLocEnd = previousSibling.loc.end.line;

            if (lLocStart - nLocEnd > 2) {
              context.report({
                node: licenseComment,
                loc: licenseComment.loc.start,
                message: 'Superfluous new lines before license header'
              });
            }

            if (lLocStart - nLocEnd < 2) {
              context.report({
                node: licenseComment,
                loc: licenseComment.loc.start,
                message: 'Missing new line before license header'
              });
            }
          } else {
            const lLocStart = licenseComment.loc.start.line;

            console.log(lLocStart);

            if (lLocStart !== 1) {
              context.report({
                node: licenseComment,
                loc: licenseComment.loc.start,
                message: 'Superfluous new lines before license header'
              });
            }
          }
        } else {
          context.report({
            node,
            message: 'Missing license header'
          });
        }
      }
    };
  }
};
