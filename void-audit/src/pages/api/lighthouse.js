import { lighthouseCheck,  } from "@foo-software/lighthouse-check";
import https from 'https';
import http from 'http';
import Redis from 'ioredis';


const redis = new Redis({
    host: process.env.REDIS_HOST, 
    port: 6379
  });

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

        // Check if report exists in Redis
        const cachedReport = await redis.get(isValidUrl);
        if (cachedReport) {
            return res.status(200).json({ reportPath: cachedReport });
        }

        const urlExists = await checkUrlExists(isValidUrl);
        if (!urlExists)
            return res.status(400).json({ error: `Unable to resolve ${isValidUrl}. Verify that the URL is valid.` });
        
        // // Capture a screenshot of the website using Puppeteer
        // const screenshotPath = await captureScreenshot(isValidUrl);

        /* TODO : Run lighthouse on both mobile and desktop (in background) 
            I test it but it takes a lot of time
        */
        // const [desktopReport, mobileReport] = await Promise.all([
        //     await lighthouseCheck({
        //         outputDirectory: process.env.REPORT_PATH_DEV,
        //         urls: [isValidUrl],
        //         emulatedFormFactor: "desktop",
        //     }),
            // await lighthouseCheck({
            //     outputDirectory: process.env.REPORT_PATH_DEV,
            //     urls: [isValidUrl],
            //     emulatedFormFactor: "mobile",
            // })
        // ]);

        const response = await lighthouseCheck({
            outputDirectory: process.env.REPORT_PATH_DEV,
            urls: [isValidUrl],
            emulatedFormFactor: emulatedForm,
        });

        const localReportPath = response.data[0].localReport;
        // for docker
        const reportWebPath = localReportPath.replace('/app/public/', '');
        // for local developement
        // const reportWebPath = localReportPath.replace('/Users/mac/dev/void-audit-tool/public/', '');

        // Store the report path in Redis with TTL 
        await redis.set(isValidUrl, reportWebPath, 'EX', process.env.REDIS_CACHE_TIME * 60);

        res.status(200).json({ reportPath: reportWebPath })
    } catch (error) {
        res.status(500).json({ error: error })
    }
}

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