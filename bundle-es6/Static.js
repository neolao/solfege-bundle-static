import solfege from "solfegejs";
import url from "url";
import fs from "fs";
import nodePath from "path";


/**
 * Serve static files
 */
export default class Static
{
    /**
     * Constructor
     */
    constructor()
    {
       // Set the default configuration
       this.configuration = require('../configuration/default.js');
    }

    /**
     * Override the current configuration
     *
     * @param   {Object}    customConfiguration     The custom configuration
     */
    *overrideConfiguration(customConfiguration)
    {
        this.configuration = Object.assign(this.configuration, customConfiguration);

        // @todo Check if the parameter "directories" is an array
    }

    /**
     * The server middleware
     *
     * @param   {solfege.bundle.server.Request}     request     The request
     * @param   {solfege.bundle.server.Response}    response    The response
     * @param   {GeneratorFunction}                 next        The next function
     */
    *middleware(request, response, next)
    {
        let urlInfo = url.parse(request.url);
        let pathName = decodeURIComponent(urlInfo.pathname);

        let directories = this.configuration.directories;
        let directoryCount = directories.length;
        let directoryIndex;

        // Check if the file exists
        let fileExists = false;
        let filePath;
        let fileStats;
        for (directoryIndex = 0; directoryIndex < directoryCount; ++directoryIndex) {
            filePath = nodePath.normalize(nodePath.join(directories[directoryIndex], pathName));
            try {
                fileStats = yield solfege.util.Node.fs.stat(filePath);
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
    }

}

