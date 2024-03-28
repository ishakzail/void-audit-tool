import { lighthouseCheck } from "@foo-software/lighthouse-check";
import https from 'https';
import http from 'http'

export default async function handler(req, res)
{
    const { url, emulatedForm}  = req.body;
    try {
        console.log('emulatedForm == ', emulatedForm);
        console.log('url == ', url);
        const isValidUrl = validateUrl(url);
        console.log('URL after validation ----------- ', isValidUrl);
        if (!isValidUrl || isValidUrl === undefined)
        {
            console.log('INVALID URL');
            return res.status(400).json({ error: 'Invalid URL' });
        }

        const urlExists = await checkUrlExists(isValidUrl);
        console.log('urlExists -- ', urlExists);

        if (!urlExists)
        {
            console.log('url not found');
            return res.status(400).json({ error: 'URL not found' });
        }
        const response = await lighthouseCheck({
            outputDirectory: './public/reports',
            urls: [isValidUrl],
            emulatedFormFactor: emulatedForm,
        });
        const localReportPath = response.data[0].localReport;

     
        const reportWebPath = localReportPath.replace('/Users/mac/dev/void-audit-tool-4/public/', '');

        console.log("response --", response);
        res.status(200).json({ reportPath: reportWebPath })
        // console.log("response --", response);

        // res.status(200).json({data: response, message: "Report generated" })
    } catch (error) {
        console.log("error (catch) ----------- ", error.code);
        res.status(500).json({ error: error })
    }
}

const validateUrl = (url) => {
    // Regular expression pattern for a valid URL
    const urlPattern = /^(http(s)?:\/\/)?(www\.)?([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+)(\/.*)?$/;
    // const urlPattern = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

    // Check if the URL matches the pattern
    const match = url.match(urlPattern);
    console.log("match --", match);
    if (match) {
        // Extract the domain name (including subdomains) from the URL
        const protocol = match[1];
        const subdomain = match[3];
        const domain = match[4];
        const tld = match[5];
        const path = match[6];
        console.log('domain --------------------------- ', domain);
        console.log('protocol --------------------------- ', protocol);
        console.log('subdomain --------------------------- ', subdomain);
        console.log('tld --------------------------- ', tld);
        console.log('path --------------------------- ', path);
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
    console.log('URL == ', url);
    const HttpStatusCodes = [200, 301, 302, 307, 308];
    return new Promise((resolve) => {
        const protocol = url.startsWith('https') ? https : http;
        const request = protocol.get(url, (response) => {
            console.log('aji lhna');
            resolve(HttpStatusCodes.includes(response.statusCode));
        })
        request.on('error', () => {
            console.log('chuf hna');
            resolve(null);
        });
    });
}