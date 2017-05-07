/**
 * format jsx indent with parentheses `()`
 */
'use strict';

const tk = require('rocambole-token');
const indent = require('rocambole-indent');
const plugin = {}

let jsxIndent = 1;

function isNodeType(node, nodeType) {
  return node && node.type === nodeType;
}

function isJSXElement(node) {
  return isNodeType(node, 'JSXElement');
}

function isCallExpression(node) {
  return isNodeType(node, 'CallExpression');
}

function isReturnStatement(node) {
  return isNodeType(node, 'ReturnStatement');
}

plugin.setOptions = function (opts) {
  jsxIndent = parseInt(opts.indent && opts.indent.JSXExpression, 10);
  if (isNaN(jsxIndent)) {
    jsxIndent = 1;
  }
};

plugin.nodeAfter = function (node) {
  if (jsxIndent === 0 || !isJSXElement(node)) return;
  if (isJSXElement(node.parent) || isCallExpression(node.parent)) return;
  let opening = tk.findPrevNonEmpty(node.startToken);
  if (!opening || opening.value !== '(') return;
  let closing = tk.findNextNonEmpty(node.endToken);
  if (!closing || closing.value !== ')') return;
  if (isReturnStatement(node.parent)) {
    /**
     * fix esformatter ReturnStatement
     * code:
     * ```
     * return (
     * <div></div>
     * );
     * ```
     * formatted:
     * ```
     * return (
     *   <div></div>
     *   );
     * ```
     * fixed:
     * ```
     * return (
     *   <div></div>
     * );
     * ```
     */
    let endToken = node.parent.endToken;
    if (endToken && endToken.value === ';') {
      node.parent.endToken = tk.findPrevNonEmpty(endToken);
      tk.removeEmptyInBetween(node.parent.endToken, endToken);
    }
  } else {
    /**
     * format declare jsx
     * code:
     * ```
     * const dom = (
     * <div></div>
     * );
     * ```
     * formated:
     * ```
     * const dom = (
     *  <div></div>
     * );
     * ```
     */
    indent.inBetween(opening, node.endToken, jsxIndent);
  }
};

module.exports = plugin;
