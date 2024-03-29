import { lighthouseCheck } from "@foo-software/lighthouse-check";
import https from 'https';
import http from 'http'

/**
 * Handles the incoming request and performs a series of validations and checks on the URL.
 *
 * @param {Object} req - The request object containing the URL and emulatedForm in the body.
 * @param {Object} res - The response object used to send the response.
 * @return {Promise<void>} - Returns a promise that resolves when the response is sent.
 */
export default async function handler(req, res)
{
    const { url, emulatedForm}  = req.body;
    try {
        const isValidUrl = validateUrl(url);
        if (!isValidUrl || isValidUrl === undefined)
            return res.status(400).json({ error: 'Invalid URL' });

        const urlExists = await checkUrlExists(isValidUrl);

        if (!urlExists)
            return res.status(400).json({ error: `Unable to resolve ${isValidUrl}. Verify that the URL is valid.` });
        
            const response = await lighthouseCheck({
            outputDirectory: './public/reports',
            urls: [isValidUrl],
            emulatedFormFactor: emulatedForm,
        });

        const localReportPath = response.data[0].localReport;
        // for docker
        const reportWebPath = localReportPath.replace('/app/public/', '');
        // for local developement
        // const reportWebPath = localReportPath.replace('/Users/mac/dev/void-audit-tool-4/public/', '');
        res.status(200).json({ reportPath: reportWebPath })
    } catch (error) {
        // console.log("error (catch) ----------- ", error);
        res.status(500).json({ error: error })
    }
}


/**
 * Validate if the input URL is in a valid format and extract relevant information from it.
 *
 * @param {string} url - The URL to be validated and parsed.
 * @return {string|null} The parsed URL with protocol, domain, and path, or null if the URL is invalid.
 */
const validateUrl = (url) => {
    // Regular expression pattern for a valid URL
    const urlPattern = /^(http(s)?:\/\/)?(www\.)?([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+)(\/.*)?$/;


    // Check if the URL matches the pattern
    const match = url.match(urlPattern);
    if (match) {
        // Extract the domain name (including subdomains) from the URL
        const protocol = match[1];
        const subdomain = match[3];
        const domain = match[4];
        const tld = match[5];
        const path = match[6];
        if (domain.startsWith('www.') && url.match(/\./g).length == 1)
            return null;
        if (tld !== 'undefined' && subdomain !== 'undefined')
            if (protocol && path)
                return `${protocol}${domain}${path}`;
            else if (protocol === undefined && path)
                return `https://${domain}${path}`;
            else
                return `https://${domain}`;
    } else {
        return null;
    }
};


/**
 * Checks if a given URL exists by sending a request and checking the HTTP status code.
 *
 * @param {string} url - The URL to check.
 * @return {Promise<boolean>} A promise that resolves to true if the URL exists and has a valid HTTP status code, otherwise false.
 */
async function checkUrlExists(url) {
    const HttpStatusCodes = [200, 301, 302, 307, 308];
    return new Promise((resolve) => {
        const protocol = url.startsWith('https') ? https : http;
        const request = protocol.get(url, (response) => {
            resolve(HttpStatusCodes.includes(response.statusCode));
        })
        request.on('error', () => {
            resolve(null);
        });
    });
}