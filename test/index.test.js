'use strict';

const fs = require('fs');
const esformatter = require('esformatter');
const esformatterJsx = require('esformatter-jsx');
const jsxIndent = require('../');

describe('esformatter-braces', function () {
  before(function () {
    esformatter.register(esformatterJsx);
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
  });
});