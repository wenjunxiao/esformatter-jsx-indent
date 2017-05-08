/**
 * format jsx indent with parentheses `()`
 */
'use strict';

const tk = require('rocambole-token');
const indent = require('rocambole-indent');
const debug = require('debug')('esformatter-jsx-indent');
const plugin = {}

let jsxIndent = 1;
let recursiveIndent = 0;

function isNodeType(node, nodeType) {
  return node && node.type === nodeType;
}

function isJSXElement(node) {
  return isNodeType(node, 'JSXElement');
}

function isReturnStatement(node) {
  return isNodeType(node, 'ReturnStatement');
}

function toLineBreak(token) {
  if (token && /^[\n \r]+$/.test(token.value)) {
    token.origType = token.type;
    token.origValue = token.value;
    token.type = 'LineBreak';
    token.value = '\n';
    return true;
  }
  return false;
}

function getIndentLevel(opts, type, def) {
  let indent = parseInt(opts[type], 10);
  if (isNaN(indent)) {
    return def;
  }
  return isNaN(indent) ? def : indent;
}

plugin.setOptions = function (opts) {
  opts = opts || { indent: {} };
  let indentOpts = opts && opts.indent || {};
  jsxIndent = getIndentLevel(indentOpts, 'JSXExpression', jsxIndent);
  recursiveIndent = getIndentLevel(indentOpts, 'JSXExpression.Recursive', recursiveIndent);
};

const IncludesNode = {
  VariableDeclarator: true,
  ReturnStatement: true,
  JSXElement: false,
  CallExpression: false
};

plugin.nodeAfter = function (node) {
  if (jsxIndent === 0 || !isJSXElement(node)) return;
  let parentType = node.parent && node.parent.type;
  debug('JSXElement parent => %s', parentType);
  if (!IncludesNode[parentType]) {
    if (recursiveIndent !== 0 && isJSXElement(node.parent)) {
      let opening = tk.findPrevNonEmpty(node.startToken);
      if (toLineBreak(opening)) {
        debug('addLevel => %s %s %j %j %s', opening.type, opening.origType, opening.value, opening.origValue, recursiveIndent);
        indent.addLevel(node.startToken, recursiveIndent);
      }
    }
    return;
  }
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
    debug('ReturnStatement => %s', endToken && endToken.value);
    if (endToken && endToken.value === ';') {
      node.parent.endToken = tk.findPrevNonEmpty(endToken);
      tk.removeEmptyInBetween(node.parent.endToken, endToken);
    }
    if (recursiveIndent !== 0) {
      let last = node.children && node.children[node.children.length - 1];
      while (toLineBreak(last)) {
        last = last.next || last.endToken;
      }
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
    debug('inBetween => %s %s %s', opening.value, closing.value, jsxIndent);
    indent.inBetween(opening, closing, jsxIndent);
  }
};

module.exports = plugin;
