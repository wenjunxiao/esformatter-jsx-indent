# esformatter-jsx-indent

[![NPM version](https://img.shields.io/npm/v/esformatter-jsx-indent.svg?style=flat-square)](https://www.npmjs.com/package/esformatter-jsx-indent)
[![Build status](https://img.shields.io/travis/wenjunxiao/esformatter-jsx-indent.svg?style=flat-square)](https://travis-ci.org/wenjunxiao/esformatter-jsx-indent)
[![Test coverage](https://img.shields.io/coveralls/wenjunxiao/esformatter-jsx-indent.svg?style=flat-square)](https://coveralls.io/github/wenjunxiao/esformatter-jsx-indent)
[![Downloads](http://img.shields.io/npm/dm/esformatter-jsx-indent.svg?style=flat-square)](https://npmjs.org/package/esformatter-jsx-indent)

  Esformatter-jsx-indent is a plugin for 
  [esformatter](https://github.com/millermedeiros/esformatter) 
  meant to format jsx files with a correct indent when use plugin
  [esformatter-jsx](https://github.com/royriojas/esformatter-jsx) 
  have  in `return` or `declare` expression.

  Turn this:
```js
function render(){
  const a = (
  <span></span>
  );
  return (
    <div>{ a }</div>
    );
}
```
  into:
```js
function render(){
  const a = (
    <span></span>
  );
  return (
    <div>{ a }</div>
  );
}
```

## Installation

```bash
$ npm install esformatter-jsx-indent --save-dev
```

## Configuration

  Add to your esformatter config file:
```json
{
  "plugins": [
    "esformatter-jsx",
    "esformatter-jsx-indent"
  ],
  "indent": {
    // By default is 1
    "JSXExpression": 1
  }
}
```