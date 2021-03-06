/**
 * @namespace solfege.bundle.static
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _solfegejs = require("solfegejs");

var _solfegejs2 = _interopRequireDefault(_solfegejs);

exports["default"] = _solfegejs2["default"].util.ObjectProxy.createPackage(__dirname);
module.exports = exports["default"];