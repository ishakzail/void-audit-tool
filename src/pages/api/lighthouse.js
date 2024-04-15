import { lighthouseCheck } from "@foo-software/lighthouse-check";

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
        // const isValidUrl = validateUrl(url);
        // if (!isValidUrl || isValidUrl === undefined)
        //     return res.status(400).json({ error: 'Invalid URL' });

        // const urlExists = await checkUrlExists(isValidUrl);

        // if (!urlExists)
        //     return res.status(400).json({ error: `Unable to resolve ${isValidUrl}. Verify that the URL is valid.` });
        
        // // Capture a screenshot of the website using Puppeteer
        // const screenshotPath = await captureScreenshot(isValidUrl);

        const response = await lighthouseCheck({
            outputDirectory: './public/reports',
            urls: [url],
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

