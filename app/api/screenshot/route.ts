import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
// import puppeteer from 'puppeteer';

const validURL = (str: string): boolean => {
    const pattern = new RegExp('^(https?:\\/\\/)?' +
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
        '((\\d{1,3}\\.){3}\\d{1,3}))' +
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
        '(\\?[;&a-z\\d%_.~+=-]*)?' +
        '(\\#[-a-z\\d_]*)?$', 'i');
    return !!pattern.test(str);
};

export async function POST(request: Request) {
    const { url, isMobile } = await request.json();

    if (!validURL(url)) {
        return NextResponse.json({ error: "Invalid URL provided" }, { status: 400 });
    }

    let browser = null;
    try {
        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
            // executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        });

        const page = await browser.newPage();

        if (isMobile) {
            await page.setViewport({
                width: 375,
                height: 812,
                deviceScaleFactor: 3,
                isMobile: true,
                hasTouch: true,
                isLandscape: false,
            });
            await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1');
        } else {
            await page.setViewport({
                height: 800,
                width: 1440,
                deviceScaleFactor: 2
            });
        }

        await page.goto(url);
        const screenshot = await page.screenshot({ encoding: "base64" });
        return NextResponse.json({ imageBase64: screenshot });

    } catch (error) {
        console.error("Screenshot capture error:", error);
        return NextResponse.json({ error: "Screenshot capture failed" }, { status: 500 });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}