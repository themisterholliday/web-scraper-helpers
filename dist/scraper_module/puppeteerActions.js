"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebsiteHTMLResponse_1 = require("./models/WebsiteHTMLResponse");
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
async function waitRandomAmountOfTimeBetween(page, min = 1000, max = 5000) {
    const randomNumber = getRandomNumber(min, max);
    console.log(`Waiting for random number: ${randomNumber}`);
    page.waitFor(randomNumber);
}
exports.waitRandomAmountOfTimeBetween = waitRandomAmountOfTimeBetween;
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
// retrievers
async function getTextContentForSelector(page, selector) {
    return page.evaluate((selector) => {
        return document.querySelector(selector).textContent;
    }, selector);
}
exports.getTextContentForSelector = getTextContentForSelector;
async function getValueForSelector(page, selector) {
    return page.evaluate((selector) => {
        return document.querySelector(selector).value;
    }, selector);
}
exports.getValueForSelector = getValueForSelector;
async function getPropertyValue(page, selector, property) {
    try {
        return page.evaluate((selector, property) => {
            const element = document.querySelector(selector);
            return element[property];
        }, selector, property);
    }
    catch (e) {
        throw Error(`Unable able to get ${property} from ${selector}.`);
    }
}
exports.getPropertyValue = getPropertyValue;
async function getTextContentForAllSelectors(page, selector) {
    const results = await page.evaluate((selector) => {
        const divs = Array.from(document.querySelectorAll(selector));
        return divs.map((div) => {
            div.textContent.trim();
        });
    }, selector);
    return results;
}
exports.getTextContentForAllSelectors = getTextContentForAllSelectors;
async function getAnchorsForAllSelectors(page, selector) {
    const results = await page.evaluate((selector) => {
        const divs = Array.from(document.querySelectorAll(selector));
        return divs.map((div) => {
            div.href;
        });
    }, selector);
    return results;
}
exports.getAnchorsForAllSelectors = getAnchorsForAllSelectors;
//# sourceMappingURL=puppeteerActions.js.map