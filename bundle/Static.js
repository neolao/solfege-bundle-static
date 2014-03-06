var solfege = require('solfegejs');
var url = require('url');
var fs = require('fs');
var nodePath = require('path');


/**
 * Serve static files
 */
var Static = solfege.util.Class.create(function()
{
    // Set the default configuration
    this.configuration = require('../configuration/default.js');

}, 'solfege.bundle.static.Static');
var proto = Static.prototype;

/**
 * The configuration
 *
 * @type {Object}
 * @api private
 */
proto.configuration;

/**
 * Override the current configuration
 *
 * @param   {Object}    customConfiguration     The custom configuration
 */
proto.overrideConfiguration = function*(customConfiguration)
{
    this.configuration = solfege.util.Object.merge(this.configuration, customConfiguration);

    // @todo Check if the parameter "directories" is an array
};

/**
 * The server middleware
 *
 * @param   {Object}                request     The request
 * @param   {Object}                response    The response
 * @param   {GeneratorFunction}     next        The next function
 */
proto.middleware = function*(request, response, next)
{
    var urlInfo = url.parse(request.url);
    var pathName = decodeURIComponent(urlInfo.pathname);


    var directories = this.configuration.directories;
    var directoryCount = directories.length;
    var directoryIndex;

    // Check if the file exists
    var fileExists = false;
    for (directoryIndex = 0; directoryIndex < directoryCount; ++directoryIndex) {
        var filePath = nodePath.normalize(nodePath.join(directories[directoryIndex], pathName));
        try {
            var fileStats = yield solfege.util.Node.fs.stat(filePath);
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
        response.body = fs.createReadStream(filePath);
        return;
    }


    // Handle the next middleware
    yield *next;
};


module.exports = Static;
