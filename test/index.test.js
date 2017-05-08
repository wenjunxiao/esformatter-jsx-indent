'use strict';

const fs = require('fs');
const path = require('path');
const esformatter = require('esformatter');
const jsxIndent = require('../');

const readFile = function (folder, name) {
  let filePath = path.join('./test', folder, name);
  return fs.readFileSync(filePath).toString();
};

const options = {
  root: true,
  indent: {
    'JSXExpression': 1,
    'JSXExpression.Recursive': 1
  }
};

describe('esformatter-braces', function () {
  before(function () {
    esformatter.register(jsxIndent);
  });
  describe('return jsx', function () {
    it('return jsx in parentheses with semicolon', function () {
      let str = 'function comp() {\n  return (\n<div></div>\n);\n}';
      let output = esformatter.format(str);
      output.should.be.eql('function comp() {\n  return (\n    <div></div>\n  );\n}');
    });
    it('return jsx in parentheses without semicolon', function () {
      let str = 'function comp() {\n  return (\n<div></div>\n)\n}';
      let output = esformatter.format(str);
      output.should.be.eql('function comp() {\n  return (\n    <div></div>\n  )\n}');
    });
  });
  describe('declare jsx', function () {
    it('declare jsx in parentheses with semicolon', function () {
      let str = 'const comp = (\n<div></div>\n);';
      let output = esformatter.format(str);
      output.should.be.eql('const comp = (\n  <div></div>\n);');
    });
    it('declare jsx in parentheses without semicolon', function () {
      let str = 'const comp = (\n<div></div>\n)';
      let output = esformatter.format(str);
      output.should.be.eql('const comp = (\n  <div></div>\n)');
    });
  });
  describe('complex jsx', function () {
    it('declare jsx in parentheses without semicolon', function () {
      let str = 'function comp() {\n  const a = (\n<span></span>\n);\n  return (\n<div></div>\n)\n}';
      let output = esformatter.format(str);
      output.should.be.eql('function comp() {\n  const a = (\n    <span></span>\n  );\n  return (\n    <div></div>\n  )\n}');
    });
    const files = fs.readdirSync('./test/fixtures/');
    files.forEach(function (file) {
      it('should transform fixture ' + file + ' and be equal expected file', function () {
        let input = readFile('fixtures', file);
        let actual = esformatter.format(input, options);
        let expected = readFile('expected', file);
        actual.should.be.eql(expected, 'file comparison failed: ' + file);
      });
    });
  });
});