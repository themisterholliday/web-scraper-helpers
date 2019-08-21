import puppeteer, { Page, Browser } from 'puppeteer';
import chalk from 'chalk';
import { WebsiteHTMLResponse } from './models/WebsiteHTMLResponse';
import { getRandomNumber } from '../util/RandomUtil';

const puppeteerLog = (message: string): void => {
  console.log(chalk.yellow.bold(message));
  console.log('––––––––––––––––––––––');
};

// Browser and page builders
async function createBrowser(
  proxyAddress?: string,
  headless: boolean = true,
): Promise<Browser> {
  puppeteerLog('Creating New Browser');
  const args = [
    '--incognito',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--disable-gpu',
  ];
  if (proxyAddress !== null) {
    args.push(`--proxy-server=${proxyAddress}`);
  }
  const browser = await puppeteer.launch({
    args,
    headless,
    defaultViewport: null,
    slowMo: 50,
  });
  return browser;
}

async function createPage(browser: Browser): Promise<Page> {
  puppeteerLog('Creating New Page');
  const page = await browser.newPage();
  return page;
}

async function closeBrowser(browser: Browser): Promise<void> {
  puppeteerLog('Closing Browser');
  await browser.close();
}

// Puppeteer Actions
async function waitRandomAmountOfTimeBetween(
  page: Page,
  min: number = 1000,
  max: number = 5000,
): Promise<void> {
  const randomNumber = getRandomNumber(min, max);
  puppeteerLog(`Waiting for random number: ${randomNumber}`);
  await page.waitFor(randomNumber);
}

async function scrollPageToEnd(page: Page): Promise<void> {
  puppeteerLog('Scrolling to end of page');
  return page.evaluate(() => {
    window.scrollBy(0, window.innerHeight);
  });
}

async function scrollPageToEndForCount(
  page: Page,
  count: number,
): Promise<void> {
  puppeteerLog(`Scrolling to end of page for count ${count}`);
  const numberOfTries = [...Array(count)];
  for (const i of numberOfTries) {
    await scrollPageToEnd(page);
    await waitRandomAmountOfTimeBetween(page, 1000, 2000);
  }
}

async function extractHTMLFromPage(page: Page): Promise<WebsiteHTMLResponse> {
  const url = page.url();
  puppeteerLog(`Evaluating Html for url: ${url}`);
  const body = await page.evaluate(() => document.body.innerHTML);
  if (body === undefined) {
    throw new Error('No html returned from page');
  }

  return new WebsiteHTMLResponse(url, body);
}

async function getTextContentForSelector(
  page: Page,
  selector: string,
): Promise<string> {
  return page.evaluate(
    selectorToEvaluate =>
      document.querySelector(selectorToEvaluate).textContent,
    selector,
  );
}

async function getValueForSelector(
  page: Page,
  selector: string,
): Promise<string> {
  return page.evaluate(
    selectorToEvaluate => document.querySelector(selectorToEvaluate).value,
    selector,
  );
}

async function getTextContentForAllSelectors(
  page: Page,
  selector: string,
): Promise<string[]> {
  const results = await page.evaluate(selectorToEvaluate => {
    const divs: HTMLElement[] = Array.from(
      document.querySelectorAll(selectorToEvaluate),
    );
    return divs.map(div => div.textContent.trim());
  }, selector);
  return results;
}

async function getAnchorsForAllSelectors(
  page: Page,
  selector: string,
): Promise<string[]> {
  const results = await page.evaluate(selectorToEvaluate => {
    const divs: HTMLAnchorElement[] = Array.from(
      document.querySelectorAll(selectorToEvaluate),
    );
    return divs.map(div => div.href);
  }, selector);
  return results;
}

async function waitForSelector(
  page: Page,
  selector: string,
  timeout: number = 30000,
): Promise<void> {
  puppeteerLog(`Waiting for Selector: ${selector}`);
  await page.waitFor(selector, { timeout });
}

async function waitTillSelectorIsVisible(
  page: Page,
  selector: string,
): Promise<void> {
  puppeteerLog(`Waiting for Selector Is Visible: ${selector}`);
  await page.waitFor(selector, { visible: true });
}

async function findSelectorAndClick(
  page: Page,
  selector: string,
): Promise<void> {
  puppeteerLog(`Finding Selector: ${selector}`);
  await page.waitForSelector(selector);
  puppeteerLog(`Clicking Selector: ${selector}`);
  await page.click(selector);
}

async function getPropertyValue(
  page: Page,
  selector: string,
  property: string,
): Promise<string> {
  puppeteerLog(
    `getPropertyValue for selector: ${selector}, property: ${property}`,
  );
  try {
    return await page.evaluate(
      (selectorToEvaluate, propertyToEvaluate) => {
        const element = document.querySelector(selectorToEvaluate);
        return element.getAttribute(propertyToEvaluate);
      },
      selector,
      property,
    );
  } catch (e) {
    throw Error(`Unable able to get ${property} from ${selector}.`);
  }
}

const blockedResourceTypes = [
  'image',
  'media',
  'font',
  'texttrack',
  'object',
  'beacon',
  'csp_report',
  'imageset',
];

const skippedResources = [
  'quantserve',
  'adzerk',
  'doubleclick',
  'adition',
  'exelator',
  'sharethrough',
  'cdn.api.twitter',
  'google-analytics',
  'googletagmanager',
  'google',
  'fontawesome',
  'facebook',
  'analytics',
  'optimizely',
  'clicktale',
  'mixpanel',
  'zedo',
  'clicksor',
  'tiqcdn',
];

async function navigatePageToURL(
  page: Page,
  url: string,
  waitTimeout: number = 0,
): Promise<void> {
  puppeteerLog(`Connecting to ${url}`);
  // await page.setRequestInterception(true);
  // await page.setUserAgent(userAgent);
  // page.on('request', request => {
  //   const requestUrl = request
  //     .url()
  //     .split('?')[0]
  //     .split('#')[0];
  //   if (
  //     blockedResourceTypes.indexOf(request.resourceType()) !== -1 ||
  //     skippedResources.some(resource => requestUrl.indexOf(resource) !== -1)
  //   ) {
  //     request.abort();
  //   } else {
  //     request.continue();
  //   }
  // });
  // const response = await page.goto(url, {
  //   timeout: 25000,
  //   waitUntil: 'networkidle2',
  // });
  // if (response.status() < 400) {
  //   await page.waitFor(3000);
  //   const html = await page.content();
  //   puppeteerLog(`Status 400 for ${url}`);
  // }

  await page.goto(url, {
    waitUntil: 'domcontentloaded',
  });
  await page.waitFor(waitTimeout);
  page.on('response', response => {
    if (response.url().endsWith("your/match"))
      console.log("response code: ", response.status());
      // do something here
  });
  puppeteerLog(`Connected to ${url}`);
}

async function inputTextIntoSelectorWithInputName(
  page: Page,
  inputName: string,
  text: string,
): Promise<void> {
  puppeteerLog(`Inputting Text: ${text} for inputName: ${inputName}`);
  await page.type(`input[name='${inputName}']`, text, { delay: 50 });
}

async function typeTextIntoSelector(
  page: Page,
  selector: string,
  text: string,
): Promise<void> {
  puppeteerLog(`Inputting Text: ${text} for selector: ${selector}`);
  await page.type(selector, text, { delay: 50 });
}

export {
  createBrowser,
  createPage,
  closeBrowser,
  waitRandomAmountOfTimeBetween,
  scrollPageToEnd,
  scrollPageToEndForCount,
  extractHTMLFromPage,
  getTextContentForSelector,
  getValueForSelector,
  getTextContentForAllSelectors,
  getAnchorsForAllSelectors,
  waitForSelector,
  waitTillSelectorIsVisible,
  findSelectorAndClick,
  getPropertyValue,
  navigatePageToURL,
  inputTextIntoSelectorWithInputName,
  typeTextIntoSelector,
};
