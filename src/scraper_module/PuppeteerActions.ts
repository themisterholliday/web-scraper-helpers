import { WebsiteHTMLResponse } from './models/WebsiteHTMLResponse';
import { Page, Browser } from 'puppeteer';
const puppeteer = require('puppeteer');

export async function scrollPageToEnd(page: Page) {
  console.log('Scrolling to end of page');
  await page.evaluate(() => {
    window.scrollBy(0, window.innerHeight);
  });
}

export async function navigatePageToURL(
  page: Page,
  url: string,
  waitTimeout: number = 0,
  unloadAllExtras: boolean = false,
) {
  console.log(`Connecting to ${url}`);

  if (unloadAllExtras) {
    console.log(`Unloading JS, CSS, and images: ${url}`);
    await page.setRequestInterception(true);
    await page.setJavaScriptEnabled(false);
    page.on('request', (req) => {
      if (
        req.resourceType() === 'stylesheet' ||
        req.resourceType() === 'font' ||
        req.resourceType() === 'image'
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });
  }

  await page.goto(url, {
    waitUntil: 'domcontentloaded',
  });
  await page.waitFor(waitTimeout);
  console.log(`Connected to ${url}`);
}

export async function waitTillSelectorIsVisible(page: Page, selector: string) {
  console.log(`Waiting for Selector: ${selector}`);
  await page.waitFor(selector, { visible: true });
}

export async function extractHTMLFromPage(
  page: Page,
): Promise<WebsiteHTMLResponse> {
  const url = page.url();
  console.log(`Evaluating Html for url: ${url}`);
  const body = await page.evaluate(() => document.body.innerHTML);
  if (body === undefined) {
    throw new Error('No html returned from page');
  }

  return new WebsiteHTMLResponse(url, body);
}

export async function findSelectorAndClick(page: Page, selector: string) {
  console.log(`Finding Selector: ${selector}`);
  await page.waitForSelector(selector);
  console.log(`Clicking Selector: ${selector}`);
  await page.click(selector);
}

export async function inputTextIntoSelectorWithInputName(
  page: Page,
  inputName: string,
  text: string,
) {
  console.log(`Inputting Text: ${text} for inputName: ${inputName}`);
  await page.evaluate((text) => {
    (document.querySelector(
      `input[type=${inputName}]`,
    ) as HTMLInputElement).value = text;
  },                  text);
}

export async function createBrowser(): Promise<Browser> {
  console.log('Creating New Browser');
  const browser = await puppeteer.launch({
    args: ['--incognito'],
  });
  return browser;
}

export async function createPage(browser: Browser): Promise<Page> {
  console.log('Creating New Page');
  const page = await browser.newPage();
  return page;
}

export async function closeBrowser(browser: Browser) {
  console.log('Closing Browser');
  await browser.close();
}

export async function waitRandomAmountOfTimeBetween(
  page: Page,
  min: number = 1000,
  max: number = 5000,
) {
  const randomNumber = getRandomNumber(min, max);
  console.log(`Waiting for random number: ${randomNumber}`);
  page.waitFor(randomNumber);
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

// retrievers
export async function getTextContentForSelector(page: Page, selector: string) {
  return page.evaluate((selector) => {
    return document.querySelector(selector).textContent;
  },                   selector);
}

export async function getValueForSelector(page: Page, selector: string) {
  return page.evaluate((selector) => {
    return document.querySelector(selector).value;
  },                   selector);
}

export async function getPropertyValue(
  page: Page,
  selector: string,
  property: string,
) {
  try {
    return page.evaluate(
      (selector, property) => {
        const element = document.querySelector(selector);
        return element[property];
      },
      selector,
      property,
    );
  } catch (e) {
    throw Error(`Unable able to get ${property} from ${selector}.`);
  }
}

export async function getTextContentForAllSelectors(
  page: Page,
  selector: string,
) {
  const results = await page.evaluate((selector) => {
    const divs: HTMLElement[] = Array.from(document.querySelectorAll(selector));
    return divs.map((div) => {
      div.textContent.trim();
    });
  },                                  selector);
  return results;
}

export async function getAnchorsForAllSelectors(page: Page, selector: string) {
  const results = await page.evaluate((selector) => {
    const divs: HTMLAnchorElement[] = Array.from(
      document.querySelectorAll(selector),
    );
    return divs.map((div) => {
      div.href;
    });
  },                                  selector);
  return results;
}
