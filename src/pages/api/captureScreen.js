import puppeteer from 'puppeteer';

export default async function handler(req, res)
{
    console.log('dkhel hna');
    const { url }  = req.body;

    console.log('REQ BODY ==== ', url);
    // Capture a screenshot of the website using Puppeteer
    const screenshotPath = await captureScreenshot(url);

    res.status(200).json({ screenshotPath: screenshotPath });
}


async function captureScreenshot(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const screenshotPath = `./public/screenshots/${Date.now()}.png`;
    await page.screenshot({ path: screenshotPath });
    await browser.close();
    return screenshotPath;
}