import puppeteer, { Page, Browser } from 'puppeteer';
import { WebsiteHTMLResponse } from './models/WebsiteHTMLResponse';
import { getRandomNumber } from '../util/RandomUtil';

// Options
export interface PuppeteerOptions {
  selector?: string;
  property?: string;
  min?: number;
  max?: number;
  url?: string;
  waitTimeout?: number;
  unloadAllExtras?: boolean;
  inputName?: string;
  text?: string;
  proxyAddress?: string;
}

export class EmptyPuppeteerOptions implements PuppeteerOptions {}

export class WaitRandomTimeOptions implements PuppeteerOptions {
  public min: number;

  public max: number;

  public constructor(min: number = 1000, max: number = 5000) {
    this.min = min;
    this.max = max;
  }
}

export class PuppeteerSelectorOptions implements PuppeteerOptions {
  public selector: string;

  public constructor(selector: string) {
    this.selector = selector;
  }
}

export class PuppeteerSelectorPropertyOptions implements PuppeteerOptions {
  public selector: string;

  public property: string;

  public constructor(selector: string, property: string) {
    this.selector = selector;
    this.property = property;
  }
}

export class NavigatePageToURLOptions implements PuppeteerOptions {
  public url: string;

  public waitTimeout: number;

  public unloadAllExtras: boolean;

  public constructor(
    url: string,
    waitTimeout: number = 0,
    unloadAllExtras: boolean = false,
  ) {
    this.url = url;
    this.waitTimeout = waitTimeout;
    this.unloadAllExtras = unloadAllExtras;
  }
}

export class InputTextIntoSelectorWithInputNameOptions
  implements PuppeteerOptions {
  public inputName: string;

  public text: string;

  public unloadAllExtras: boolean;

  public constructor(inputName: string, text: string) {
    this.inputName = inputName;
    this.text = text;
  }
}

// Browser and page builders
export async function createBrowser(proxyAddress?: string): Promise<Browser> {
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

export async function createPage(browser: Browser): Promise<Page> {
  console.log('Creating New Page');
  const page = await browser.newPage();
  return page;
}

export async function closeBrowser(browser: Browser): Promise<void> {
  console.log('Closing Browser');
  await browser.close();
}

// Puppeteer Actions
export async function waitRandomAmountOfTimeBetween(
  page: Page,
  options: PuppeteerOptions,
): Promise<void> {
  const { min, max } = options;
  const randomNumber = getRandomNumber(min, max);
  console.log(`Waiting for random number: ${randomNumber}`);
  await page.waitFor(randomNumber);
}

export async function scrollPageToEnd(page: Page): Promise<void> {
  console.log('Scrolling to end of page');
  return page.evaluate(() => {
    window.scrollBy(0, window.innerHeight);
  });
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

export async function getTextContentForSelector(
  page: Page,
  options: PuppeteerOptions,
): Promise<string> {
  const { selector } = options;
  return page.evaluate(
    selectorToEvaluate =>
      document.querySelector(selectorToEvaluate).textContent,
    selector,
  );
}

export async function getValueForSelector(
  page: Page,
  options: PuppeteerOptions,
): Promise<string> {
  const { selector } = options;
  return page.evaluate(
    selectorToEvaluate => document.querySelector(selectorToEvaluate).value,
    selector,
  );
}

export async function getTextContentForAllSelectors(
  page: Page,
  options: PuppeteerOptions,
): Promise<string[]> {
  const { selector } = options;
  const results = await page.evaluate(selectorToEvaluate => {
    const divs: HTMLElement[] = Array.from(
      document.querySelectorAll(selectorToEvaluate),
    );
    return divs.map(div => div.textContent.trim());
  }, selector);
  return results;
}

export async function getAnchorsForAllSelectors(
  page: Page,
  options: PuppeteerOptions,
): Promise<string[]> {
  const { selector } = options;
  const results = await page.evaluate(selectorToEvaluate => {
    const divs: HTMLAnchorElement[] = Array.from(
      document.querySelectorAll(selectorToEvaluate),
    );
    return divs.map(div => div.href);
  }, selector);
  return results;
}

export async function waitTillSelectorIsVisible(
  page: Page,
  options: PuppeteerOptions,
): Promise<void> {
  const { selector } = options;
  console.log(`Waiting for Selector: ${selector}`);
  await page.waitFor(selector, { visible: true });
}

export async function findSelectorAndClick(
  page: Page,
  options: PuppeteerOptions,
): Promise<void> {
  const { selector } = options;
  console.log(`Finding Selector: ${selector}`);
  await page.waitForSelector(selector);
  console.log(`Clicking Selector: ${selector}`);
  await page.click(selector);
}

export async function getPropertyValue(
  page: Page,
  options: PuppeteerOptions,
): Promise<string> {
  const { selector, property } = options;
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

export async function navigatePageToURL(
  page: Page,
  options: PuppeteerOptions,
): Promise<void> {
  const { url, waitTimeout, unloadAllExtras } = options;
  console.log(`Connecting to ${url}`);

  if (unloadAllExtras) {
    console.log(`Unloading JS, CSS, and images: ${url}`);
    await page.setRequestInterception(true);
    await page.setJavaScriptEnabled(false);
    page.on('request', req => {
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

export async function inputTextIntoSelectorWithInputName(
  page: Page,
  options: PuppeteerOptions,
): Promise<void> {
  const { text, inputName } = options;
  console.log(`Inputting Text: ${text} for inputName: ${inputName}`);
  await page.evaluate((textToEvaluate: string) => {
    (document.querySelector(
      `input[type=${inputName}]`,
    ) as HTMLInputElement).value = textToEvaluate;
  }, text);
}
