import puppeteer, { Page, Browser } from 'puppeteer';
import { WebsiteHTMLResponse } from './models/WebsiteHTMLResponse';
import { getRandomNumber } from '../util/RandomUtil';

// Browser and page builders
async function createBrowser(proxyAddress?: string): Promise<Browser> {
  console.log('Creating New Browser');
  const args = ['--incognito'];
  if (proxyAddress !== undefined) {
    args.push(`--proxy-server=${proxyAddress}`);
  }
  const browser = await puppeteer.launch({
    args,
  });
  return browser;
}

async function createPage(browser: Browser): Promise<Page> {
  console.log('Creating New Page');
  const page = await browser.newPage();
  return page;
}

async function closeBrowser(browser: Browser): Promise<void> {
  console.log('Closing Browser');
  await browser.close();
}

// Puppeteer Actions
async function waitRandomAmountOfTimeBetween(
  page: Page,
  min: number = 1000,
  max: number = 5000,
): Promise<void> {
  const randomNumber = getRandomNumber(min, max);
  console.log(`Waiting for random number: ${randomNumber}`);
  await page.waitFor(randomNumber);
}

async function scrollPageToEnd(page: Page): Promise<void> {
  console.log('Scrolling to end of page');
  return page.evaluate(() => {
    window.scrollBy(0, window.innerHeight);
  });
}

async function extractHTMLFromPage(page: Page): Promise<WebsiteHTMLResponse> {
  const url = page.url();
  console.log(`Evaluating Html for url: ${url}`);
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

async function waitTillSelectorIsVisible(
  page: Page,
  selector: string,
): Promise<void> {
  console.log(`Waiting for Selector: ${selector}`);
  await page.waitFor(selector, { visible: true });
}

async function findSelectorAndClick(
  page: Page,
  selector: string,
): Promise<void> {
  console.log(`Finding Selector: ${selector}`);
  await page.waitForSelector(selector);
  console.log(`Clicking Selector: ${selector}`);
  await page.click(selector);
}

async function getPropertyValue(
  page: Page,
  selector: string,
  property: string,
): Promise<string> {
  try {
    return page.evaluate(
      (selectorToEvaluate, propertyToEvaluate) => {
        const element = document.querySelector(selectorToEvaluate);
        return element[propertyToEvaluate];
      },
      selector,
      property,
    );
  } catch (e) {
    throw Error(`Unable able to get ${property} from ${selector}.`);
  }
}

async function navigatePageToURL(
  page: Page,
  url: string,
  waitTimeout: number = 0,
  unloadStyles: boolean = true,
  unloadJavascript: boolean = false,
): Promise<void> {
  console.log(`Connecting to ${url}`);

  //   if (unloadJavascript) {
  //     console.log(`Unloading JS: ${url}`);
  //     await page.setRequestInterception(true);
  //     await page.setJavaScriptEnabled(false);
  //   }

  //   if (unloadStyles) {
  //     console.log(`Unloading Fonts, and images: ${url}`);
  //     await page.setRequestInterception(true);
  //     page.on('request', req => {
  //       if (req.resourceType() === 'font' || req.resourceType() === 'image') {
  //         req.abort();
  //       } else {
  //         req.continue();
  //       }
  //     });
  //   }

  await page.goto(url, {
    waitUntil: 'domcontentloaded',
  });
  await page.waitFor(waitTimeout);
  console.log(`Connected to ${url}`);
}

async function inputTextIntoSelectorWithInputName(
  page: Page,
  inputName: string,
  text: string,
): Promise<void> {
  console.log(`Inputting Text: ${text} for inputName: ${inputName}`);
  await page.evaluate((textToEvaluate: string) => {
    (document.querySelector(
      `input[type=${inputName}]`,
    ) as HTMLInputElement).value = textToEvaluate;
  }, text);
}

export {
  createBrowser,
  createPage,
  closeBrowser,
  waitRandomAmountOfTimeBetween,
  scrollPageToEnd,
  extractHTMLFromPage,
  getTextContentForSelector,
  getValueForSelector,
  getTextContentForAllSelectors,
  getAnchorsForAllSelectors,
  waitTillSelectorIsVisible,
  findSelectorAndClick,
  getPropertyValue,
  navigatePageToURL,
  inputTextIntoSelectorWithInputName,
};
