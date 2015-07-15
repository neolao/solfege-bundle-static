"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _solfegejs = require("solfegejs");

var _solfegejs2 = _interopRequireDefault(_solfegejs);

var _url = require("url");

var _url2 = _interopRequireDefault(_url);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

/**
 * Serve static files
 */

var Static = (function () {
    /**
     * Constructor
     */

    function Static() {
        _classCallCheck(this, Static);

        // Set the default configuration
        this.configuration = require("../configuration/default.js");
    }

    _createClass(Static, [{
        key: "overrideConfiguration",

        /**
         * Override the current configuration
         *
         * @param   {Object}    customConfiguration     The custom configuration
         */
        value: function* overrideConfiguration(customConfiguration) {
            this.configuration = _extends(this.configuration, customConfiguration);

            // @todo Check if the parameter "directories" is an array
        }
    }, {
        key: "middleware",

        /**
         * The server middleware
         *
         * @param   {solfege.bundle.server.Request}     request     The request
         * @param   {solfege.bundle.server.Response}    response    The response
         * @param   {GeneratorFunction}                 next        The next function
         */
        value: function* middleware(request, response, next) {
            var urlInfo = _url2["default"].parse(request.url);
            var pathName = decodeURIComponent(urlInfo.pathname);

            var directories = this.configuration.directories;
            var directoryCount = directories.length;
            var directoryIndex = undefined;

            // Check if the file exists
            var fileExists = false;
            var filePath = undefined;
            var fileStats = undefined;
            for (directoryIndex = 0; directoryIndex < directoryCount; ++directoryIndex) {
                filePath = _path2["default"].normalize(_path2["default"].join(directories[directoryIndex], pathName));
                try {
                    fileStats = yield _solfegejs2["default"].util.Node.fs.stat(filePath);
                } catch (error) {
                    continue;
                }

                if (fileStats.isDirectory()) {
                    continue;
                }

                fileExists = true;
                break;
            }

            // Serve the file
            if (fileExists) {
                response.statusCode = 200;
                response.body = _fs2["default"].createReadStream(filePath);
                return;
            }

            // Handle the next middleware
            yield* next;
        }
    }]);

    return Static;
})();

exports["default"] = Static;
module.exports = exports["default"];