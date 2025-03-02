// const SCREENSHOT_API = "https://2wg20nrbv4.execute-api.eu-west-1.amazonaws.com/default/screenshot"

// export async function captureWebsiteScreenshot(url: string, isMobile = false) {
//   try {
//     const response = await fetch(`${SCREENSHOT_API}?url=${encodeURIComponent(url)}${isMobile ? "&mobile=1" : ""}`)
//     if (!response.ok) {
//       throw new Error("Screenshot capture failed")
//     }
//     const data = await response.json()
//     return `data:image/png;base64,${data.imageBase64}`
//   } catch (error) {
//     console.error("Screenshot capture error:", error)
//     throw error
//   }
// }

// import puppeteer from 'puppeteer';
// import puppeteer from 'puppeteer-core';

// const validURL = (str: string): boolean => {
//     const pattern = new RegExp('^(https?:\\/\\/)?' +
//         '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
//         '((\\d{1,3}\\.){3}\\d{1,3}))' +
//         '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
//         '(\\?[;&a-z\\d%_.~+=-]*)?' +
//         '(\\#[-a-z\\d_]*)?$', 'i');
//     return !!pattern.test(str);
// };

// export async function captureWebsiteScreenshot(url: string, isMobile = false): Promise<string> {
//     if (!validURL(url)) {
//         throw new Error("Invalid URL provided");
//     }

//     let browser = null;
//     try {
//         browser = await puppeteer.launch({
//             // headless: "new",
//             executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 
//         });

//         const page = await browser.newPage();

//         if (isMobile) {
//             await page.setViewport({
//                 width: 375,
//                 height: 812,
//                 deviceScaleFactor: 3,
//                 isMobile: true,
//                 hasTouch: true,
//                 isLandscape: false,
//             });
//             await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1');
//         } else {
//             await page.setViewport({
//                 height: 800,
//                 width: 1440,
//                 deviceScaleFactor: 2
//             });
//         }

//         await page.goto(url);
//         const screenshot = await page.screenshot({ encoding: "base64" });
//         return `data:image/png;base64,${screenshot}`;

//     } catch (error) {
//         console.error("Screenshot capture error:", error);
//         throw error;
//     } finally {
//         if (browser) {
//             await browser.close();
//         }
//     }
// }
export async function captureWebsiteScreenshot(url: string, isMobile = false): Promise<string> {
  try {
      const response = await fetch('/api/screenshot', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url, isMobile }),
      });

      if (!response.ok) {
          throw new Error("Screenshot capture failed");
      }

      const data = await response.json();
      return `data:image/png;base64,${data.imageBase64}`;
  }
  catch (error) {
      console.error("Screenshot capture error:", error);
      throw error;
  }
}