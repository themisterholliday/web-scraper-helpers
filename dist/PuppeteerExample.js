"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteerActions_1 = require("./scraper_module/puppeteerActions");
const CheerioActions_1 = require("./scraper_module/CheerioActions");
// (async () => {
//   const browser = await createBrowser();
//   const page = await createPage(browser);
//   const one = new PuppeteerScraperMinionJobModel('navigatePageToURL');
//   //   const two = new PuppeteerScraperMinionJobModel(
//   //     'getTextContentForSelector',
//   //     2,
//   //     getTextContentForSelector(page, 'p'),
//   //   );
//   const testQueue = new bull('test-queue');
//   // @TODO: fix last in last out or whatever is going on here
//   const minionJobs = [one];
//   new PuppeteerScraperOverlordJobListener(
//     testQueue,
//     (job, jobModel) => {
//       console.log(job.id, 'overlord job id');
//       console.log(jobModel, 'completed overlord job model');
//       console.log(jobModel.result, 'overlord job result');
//       testQueue.close();
//       closeBrowser(browser);
//     },
//     (jobModel) => {
//       console.log(jobModel, 'failed overlord job');
//       console.log(jobModel.result.error, 'failed overlord error');
//       console.log(
//         jobModel.result.failedMinionJobModel,
//         'the failed minion job',
//       );
//       testQueue.close();
//     },
//   );
//   // @TODO: use an overlord manager
//   testQueue.process(async (job: Job) => {
//     console.log(job.data.perform());
//     const jobData = <PuppeteerScraperOverlordJobModel>job.data;
//     const builtJob = new PuppeteerScraperOverlordJob(jobData);
//     return builtJob.run().catch((error: Error) => {
//       console.log('movedToFailed from overlord');
//       job.moveToFailed({ message: error.message }, true);
//     });
//   });
//   const overlordjob1 = new PuppeteerScraperOverlordJobModel(
//     'Overlord Job 1 description',
//     minionJobs,
//   );
//   testQueue.add(overlordjob1);
// })();
(async () => {
    const browser = await puppeteerActions_1.createBrowser();
    const page = await puppeteerActions_1.createPage(browser);
    const url = "https://chrome.google.com/webstore/category/ext/11-web-development";
    const links = await getLinksFromChromeWebStore(url, page);
    const filteredLinks = links
        .filter(link => {
        return link !== undefined;
    })
        .filter(link => {
        return link.includes("/detail");
    });
    const scrapes = [];
    let counter = 0;
    for (const link of filteredLinks) {
        counter += 1;
        try {
            const scrape = await detailScrapeChromeWebStore(link, page);
            scrapes.push(scrape);
        }
        catch (_a) {
            const path = `${__dirname}/../${counter}.png`;
            await page.screenshot({ path });
            continue;
        }
    }
    await promiseWriteFile("scrape_v3.json", JSON.stringify(scrapes));
    // const path = `${__dirname}/../test.json`;
    // const data = await promiseReadFile(path, 'utf8');
    // const jsonObject = JSON.parse(data.toString());
    await exportCSVFromJSONObject(scrapes, "scrape_v3");
    await puppeteerActions_1.closeBrowser(browser);
})();
async function getLinksFromChromeWebStore(url, page) {
    await puppeteerActions_1.navigatePageToURL(page, url);
    await puppeteerActions_1.waitTillSelectorIsVisible(page, "div.h-a-x");
    const numberOfTries = [...Array(20)];
    for (const i in numberOfTries) {
        await puppeteerActions_1.scrollPageToEnd(page);
        await puppeteerActions_1.waitRandomAmountOfTimeBetween(page);
    }
    const html = await puppeteerActions_1.extractHTMLFromPage(page);
    const links = CheerioActions_1.getAllLinks(html.html);
    await puppeteerActions_1.waitRandomAmountOfTimeBetween(page);
    return links;
}
class DetailScrape {
    constructor(title, date, url) {
        this.title = title;
        this.date = date;
        this.url = url;
    }
}
async function detailScrapeChromeWebStore(url, page) {
    await puppeteerActions_1.navigatePageToURL(page, url);
    await puppeteerActions_1.waitRandomAmountOfTimeBetween(page);
    const html = await puppeteerActions_1.extractHTMLFromPage(page);
    const titleSelector = "h1.e-f-w";
    const title = await puppeteerActions_1.getTextContentForSelector(page, titleSelector);
    const date = CheerioActions_1.getTextFromElementAfterElementContainingString(html.html, "Updated");
    return new DetailScrape(title, date, url);
}
function promiseWriteFile(fileName, object) {
    const fs = require("fs");
    return new Promise((resolve, reject) => {
        fs.writeFile(fileName, object, (err, data) => {
            err ? reject(err) : resolve(data);
        });
    });
}
function promiseReadFile(fileName, type) {
    const fs = require("fs");
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, type, (err, data) => {
            err ? reject(err) : resolve(data);
        });
    });
}
async function exportCSVFromJSONObject(jsonObject, fileName) {
    // Create CSV from jsonObject
    const items = jsonObject;
    // handle null values here
    const replacer = (key, value) => {
        return value === null ? "" : value;
    };
    const header = Object.keys(items[0]);
    const seperator = ";";
    let csv = items.map((row) => {
        return header
            .map(fieldName => {
            const string = JSON.stringify(row[fieldName], replacer);
            if (string === "" || string === undefined) {
                return string;
            }
            return string;
            // .replace(/,/g, '"comma"');
        })
            .join(seperator);
    });
    csv.unshift(header.join(seperator));
    csv = csv.join("\r\n");
    const fileNameWithExtension = `${fileName}.txt`;
    // Write csv to file
    await promiseWriteFile(`./${fileNameWithExtension}`, csv);
    console.log(`${fileNameWithExtension} was saved!`);
}
exports.exportCSVFromJSONObject = exportCSVFromJSONObject;
//# sourceMappingURL=PuppeteerExample.js.map