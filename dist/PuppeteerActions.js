"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebsiteHTMLResponse_1 = require("./WebsiteHTMLResponse");
const puppeteer = require('puppeteer');
async function scrollPageToEnd(page) {
    console.log('Scrolling to end of page');
    await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
    });
}
exports.scrollPageToEnd = scrollPageToEnd;
async function navigatePageToURL(page, url, waitTimeout = 0, unloadAllExtras = false) {
    console.log(`Connecting to ${url}`);
    if (unloadAllExtras) {
        console.log(`Unloading JS, CSS, and images: ${url}`);
        await page.setRequestInterception(true);
        // @TODO: Should we always disable javascript?
        await page.setJavaScriptEnabled(false);
        page.on('request', (req) => {
            if (req.resourceType() === 'stylesheet' ||
                req.resourceType() === 'font' ||
                req.resourceType() === 'image') {
                req.abort();
            }
            else {
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
exports.navigatePageToURL = navigatePageToURL;
async function waitTillSelectorIsVisible(page, selector) {
    console.log(`Waiting for Selector: ${selector}`);
    await page.waitFor(selector, { visible: true });
}
exports.waitTillSelectorIsVisible = waitTillSelectorIsVisible;
async function extractHTMLFromPage(page) {
    const url = page.url();
    console.log(`Evaluating Html for url: ${url}`);
    const body = await page.evaluate(() => document.body.innerHTML);
    if (body === undefined) {
        throw new Error('No html returned from page');
    }
    return new WebsiteHTMLResponse_1.WebsiteHTMLResponse(url, body);
}
exports.extractHTMLFromPage = extractHTMLFromPage;
async function findSelectorAndClick(page, selector) {
    console.log(`Finding Selector: ${selector}`);
    await page.waitForSelector(selector);
    console.log(`Clicking Selector: ${selector}`);
    await page.click(selector);
}
exports.findSelectorAndClick = findSelectorAndClick;
async function inputTextIntoSelectorWithInputName(page, inputName, text) {
    console.log(`Inputting Text: ${text} for inputName: ${inputName}`);
    await page.evaluate((text) => {
        document.querySelector(`input[type=${inputName}]`).value = text;
    }, text);
}
exports.inputTextIntoSelectorWithInputName = inputTextIntoSelectorWithInputName;
async function createBrowser() {
    console.log('Creating New Browser');
    const browser = await puppeteer.launch({
        args: ['--incognito'],
    });
    return browser;
}
exports.createBrowser = createBrowser;
async function createPage(browser) {
    console.log('Creating New Page');
    const page = await browser.newPage();
    return page;
}
exports.createPage = createPage;
async function closeBrowser(browser) {
    console.log('Closing Browser');
    await browser.close();
}
exports.closeBrowser = closeBrowser;
// export async function valueFromSelector(page: Page, selector: string) {
//   console.log(`Finding Selector: ${selector}`);
//   await page.waitForSelector(selector);
//   console.log(`Clicking Selector: ${selector}`);
//   await page.click(selector);
//   return page.evaluate;
// }
async function copy(page, selector) {
    console.log(`Copying Text From Selector: ${selector}`);
}
exports.copy = copy;
async function paste(page, selector) {
    console.log(`Pasting Text To Selector: ${selector}`);
    await findSelectorAndClick(page, selector);
    await page.keyboard.down('Command');
    await page.keyboard.press('P');
    await page.keyboard.up('Command');
}
exports.paste = paste;
// -- profile createor
// Create first name
// create last name
// Create email
// create password
// create date of birth above 1970
// male or female
// - profile
// picture
// some bio
// city
// email confirmation
// go to fake email generator
// copy fake email
// return ulr
// after signup, copy confirmation or click confirm account
// things to do first
// go through and like some things
// join pages?
//# sourceMappingURL=puppeteerActions.js.map