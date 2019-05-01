import { Page, Browser } from 'puppeteer';
import {
  waitRandomAmountOfTimeBetween,
  scrollPageToEnd,
  extractHTMLFromPage,
  getTextContentForSelector,
  getValueForSelector,
  getAnchorsForAllSelectors,
  waitTillSelectorIsVisible,
  findSelectorAndClick,
  getPropertyValue,
  navigatePageToURL,
  inputTextIntoSelectorWithInputName,
  PuppeteerOptions,
  EmptyPuppeteerOptions,
  WaitRandomTimeOptions,
  PuppeteerSelectorOptions,
  PuppeteerSelectorPropertyOptions,
  NavigatePageToURLOptions,
  InputTextIntoSelectorWithInputNameOptions,
} from './scraper_module/PuppeteerAbstractMethods';
import {
  getAllLinks,
  getTextFromElementContainingString,
  getTextFromElementAfterElementContainingString,
} from './scraper_module/CheerioActions';
import { randomBoolByPercentage } from './util/RandomUtil';

async function getLinksFromChromeWebStore(
  url: string,
  page: Page,
  numberOfPages: number,
): Promise<string[]> {
  await navigatePageToURL(page, { url });

  await waitTillSelectorIsVisible(page, { selector: 'div.h-a-x' });

  const numberOfTries = [...Array(numberOfPages)];
  for (const i in numberOfTries) {
    await scrollPageToEnd(page);
    await waitRandomAmountOfTimeBetween(page, new WaitRandomTimeOptions());
  }

  const html = await extractHTMLFromPage(page);
  const links = getAllLinks(html.html);

  await waitRandomAmountOfTimeBetween(page, new WaitRandomTimeOptions());
  return links;
}

// class DetailScrape {
//   constructor(public title: string, public date: string, public url: string) {}
// }

// async function detailScrapeChromeWebStore(
//   url: string,
//   page: Page,
// ): Promise<DetailScrape> {
//   const pageOptions = new PuppeteerPageOptions(page);
//   const navigateOptions = new NavigatePageToURLOptions(page, url);
//   await navigatePageToURL(navigateOptions);
//   const waitOptions = new WaitRandomTimeOptions(page);
//   await waitRandomAmountOfTimeBetween(waitOptions);
//   const html = await extractHTMLFromPage(pageOptions);
//   const titleSelector = 'h1.e-f-w';
//   const selectorOptions = new PuppeteerSelectorOptions(page, titleSelector);
//   const title = await getTextContentForSelector(selectorOptions);
//   const date = getTextFromElementAfterElementContainingString(
//     html.html,
//     'Updated',
//   );
//   return new DetailScrape(title, date, url);
// }

// function promiseWriteFile(fileName: any, object: any) {
//   const fs = require('fs');
//   return new Promise((resolve, reject) => {
//     fs.writeFile(fileName, object, (err: any, data: any) => {
//       err ? reject(err) : resolve(data);
//     });
//   });
// }

// function promiseReadFile(fileName: string, type: string) {
//   const fs = require('fs');
//   return new Promise((resolve, reject) => {
//     fs.readFile(fileName, type, (err: any, data: any) => {
//       err ? reject(err) : resolve(data);
//     });
//   });
// }

// export async function exportCSVFromJSONObject(
//   jsonObject: any,
//   fileName: string,
// ) {
//   // Create CSV from jsonObject
//   const items = jsonObject;

//   // handle null values here
//   const replacer = (key: any, value: any) => (value === null ? '' : value);

//   const header = Object.keys(items[0]);
//   const seperator = ';';
//   let csv = items.map((row: any) =>
//     header
//       .map(fieldName => {
//         const string = JSON.stringify(row[fieldName], replacer);
//         if (string === '' || string === undefined) {
//           return string;
//         }
//         return string;
//         // .replace(/,/g, '"comma"');
//       })
//       .join(seperator),
//   );
//   csv.unshift(header.join(seperator));
//   csv = csv.join('\r\n');

//   const fileNameWithExtension = `${fileName}.txt`;

//   // Write csv to file
//   await promiseWriteFile(`./${fileNameWithExtension}`, csv);

//   console.log(`${fileNameWithExtension} was saved!`);
// }

async function bigTest(page: Page): Promise<string[]> {
  // const browser = await createBrowser();
  // const page = await createPage(browser);
  const url =
    'https://chrome.google.com/webstore/category/ext/11-web-development';

  // const links = await getLinksFromChromeWebStore(url, page, 1);
  // const filteredLinks = links
  //   .filter(link => link !== undefined)
  //   .filter(link => link.includes('/detail'));

  // console.log(filteredLinks);
  // return filteredLinks;
  return [];
  // const scrapes: DetailScrape[] = [];
  // let counter = 0;
  // for (const link of filteredLinks) {
  //   counter += 1;
  //   try {
  //     const scrape = await detailScrapeChromeWebStore(link, page);
  //     scrapes.push(scrape);
  //   } catch {
  //     const path = `${__dirname}/../${counter}.png`;
  //     await page.screenshot({ path });
  //     continue;
  //   }
  // }

  // await promiseWriteFile('scrape_v3.json', JSON.stringify(scrapes));

  // const path = `${__dirname}/../test.json`;
  // const data = await promiseReadFile(path, 'utf8');
  // const jsonObject = JSON.parse(data.toString());
  // await exportCSVFromJSONObject(scrapes, 'scrape_v3');
  // await closeBrowser(browser);
}

// TEST RUN
// (async () => {
//   const browser = await createBrowser();
//   const page = await createPage(browser);

//   // const one = new PuppeteerScraperMinionJobModel('navigatePageToURL');
//   //   const two = new PuppeteerScraperMinionJobModel(
//   //     'getTextContentForSelector',
//   //     2,
//   //     getTextContentForSelector(page, 'p'),
//   //   );
//   const testQueue = new Bull('test-queue');

//   // @TODO: fix last in last out or whatever is going on here
//   // const minionJobs = [one];

//   testQueue.on('completed', (job, result) => {
//     console.log(`Job completed with result ${result}`);
//     testQueue.close();
//     browser.close();
//   });

//   testQueue.process('minionCrawl', async (job: Job) => {
//     const { action } = job.data;
//     const actionToRun = await puppeteerActionFrom(page, action);
//     return actionToRun();
//   });

//   const testAction = new NavigatePageToURLAction('https://www.google.com');
//   testQueue.add('minionCrawl', {
//     action: testAction,
//   });
// })();
