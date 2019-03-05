"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebsiteHTMLResponse_d_1 = require("./types/WebsiteHTMLResponse.d");
async function scrollPageToEnd(page) {
    console.log('Scrolling to end of page');
    await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
    });
}
async function navigatePageToURL(url, page, waitTimeout = 0, unloadAllExtras = false) {
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
async function waitTillSelectorIsVisible(page, selector) {
    console.log(`Waiting for Selector: ${selector}`);
    await page.waitFor(selector, { visible: true });
}
async function extractHTMLFromPage(page) {
    const url = page.url();
    console.log(`Evaluating Html for url: ${url}`);
    const body = await page.evaluate(() => document.body.innerHTML);
    if (body === undefined) {
        throw new Error('No html returned from page');
    }
    return new WebsiteHTMLResponse_d_1.WebsiteHTMLResponse(url, body);
}
async function findSelectorAndClick(page, selector) {
    console.log(`Finding Selector: ${selector}`);
    await page.waitForSelector(selector);
    console.log(`Clicking Selector: ${selector}`);
    await page.click(selector);
}
async function inputTextIntoSelectorWithInputName(page, inputName, text) {
    console.log(`Inputting Text: ${text} for inputName: ${inputName}`);
    await page.evaluate((text) => {
        document.querySelector(`input[type=${inputName}]`).value = text;
    }, text);
}
class Profile {
    constructor(email, password, firstName, lastName, dateOfBirth, gender, bio, city) { }
}
// export abstract class Testing {
//   async buildProfile(): Promise<Profile> {}
// }
// Run
const puppeteer = require('puppeteer');
const duckRootURL = 'https://duckduckgo.com/?q=';
const keyword = 'test';
async function run() {
    const url = duckRootURL + keyword;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await navigatePageToURL(url, page);
    await scrollPageToEnd(page);
    // await page.screenshot({
    //   path: 'screenshot.png',
    // });
    console.log(`Finished running url: ${url}`);
    browser.close();
}
(async () => {
    await run().catch(console.error);
})();
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
//# sourceMappingURL=actions.js.map