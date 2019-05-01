"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const WebsiteHTMLResponse_1 = require("./models/WebsiteHTMLResponse");
class EmptyPuppeteerOptions {
}
// Browser and page builders
async function createBrowser(proxyAddress) {
    console.log('Creating New Browser');
    const args = ['--incognito'];
    if (proxyAddress !== undefined) {
        args.push(`--proxy-server=${proxyAddress}`);
    }
    const browser = await puppeteer_1.default.launch({
        args,
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
// Puppeteer Actions
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
class WaitRandomTimeOptions {
    constructor(min = 1000, max = 5000) {
        this.min = min;
        this.max = max;
    }
}
exports.WaitRandomTimeOptions = WaitRandomTimeOptions;
async function waitRandomAmountOfTimeBetween(page, options) {
    const { min, max } = options;
    const randomNumber = getRandomNumber(min, max);
    console.log(`Waiting for random number: ${randomNumber}`);
    await page.waitFor(randomNumber);
}
exports.waitRandomAmountOfTimeBetween = waitRandomAmountOfTimeBetween;
async function scrollPageToEnd(page) {
    console.log('Scrolling to end of page');
    return page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
    });
}
exports.scrollPageToEnd = scrollPageToEnd;
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
// Page Selector Options
class PuppeteerSelectorOptions {
    constructor(selector) {
        this.selector = selector;
    }
}
exports.PuppeteerSelectorOptions = PuppeteerSelectorOptions;
async function getTextContentForSelector(page, options) {
    const { selector } = options;
    return page.evaluate(selectorToEvaluate => document.querySelector(selectorToEvaluate).textContent, selector);
}
exports.getTextContentForSelector = getTextContentForSelector;
async function getValueForSelector(page, options) {
    const { selector } = options;
    return page.evaluate(selectorToEvaluate => document.querySelector(selectorToEvaluate).value, selector);
}
exports.getValueForSelector = getValueForSelector;
async function getTextContentForAllSelectors(page, options) {
    const { selector } = options;
    const results = await page.evaluate(selectorToEvaluate => {
        const divs = Array.from(document.querySelectorAll(selectorToEvaluate));
        return divs.map(div => div.textContent.trim());
    }, selector);
    return results;
}
exports.getTextContentForAllSelectors = getTextContentForAllSelectors;
async function getAnchorsForAllSelectors(page, options) {
    const { selector } = options;
    const results = await page.evaluate(selectorToEvaluate => {
        const divs = Array.from(document.querySelectorAll(selectorToEvaluate));
        return divs.map(div => div.href);
    }, selector);
    return results;
}
exports.getAnchorsForAllSelectors = getAnchorsForAllSelectors;
async function waitTillSelectorIsVisible(page, options) {
    const { selector } = options;
    console.log(`Waiting for Selector: ${selector}`);
    await page.waitFor(selector, { visible: true });
}
exports.waitTillSelectorIsVisible = waitTillSelectorIsVisible;
async function findSelectorAndClick(page, options) {
    const { selector } = options;
    console.log(`Finding Selector: ${selector}`);
    await page.waitForSelector(selector);
    console.log(`Clicking Selector: ${selector}`);
    await page.click(selector);
}
exports.findSelectorAndClick = findSelectorAndClick;
// Selector Property Options
class PuppeteerSelectorPropertyOptions {
    constructor(selector, property) {
        this.selector = selector;
        this.property = property;
    }
}
exports.PuppeteerSelectorPropertyOptions = PuppeteerSelectorPropertyOptions;
async function getPropertyValue(page, options) {
    const { selector, property } = options;
    try {
        return page.evaluate((selectorToEvaluate, propertyToEvaluate) => {
            const element = document.querySelector(selectorToEvaluate);
            return element[propertyToEvaluate];
        }, selector, property);
    }
    catch (e) {
        throw Error(`Unable able to get ${property} from ${selector}.`);
    }
}
exports.getPropertyValue = getPropertyValue;
// Misc Options
class NavigatePageToURLOptions {
    constructor(url, waitTimeout = 0, unloadAllExtras = false) {
        this.url = url;
        this.waitTimeout = waitTimeout;
        this.unloadAllExtras = unloadAllExtras;
    }
}
exports.NavigatePageToURLOptions = NavigatePageToURLOptions;
async function navigatePageToURL(page, options) {
    const { url, waitTimeout, unloadAllExtras } = options;
    console.log(`Connecting to ${url}`);
    if (unloadAllExtras) {
        console.log(`Unloading JS, CSS, and images: ${url}`);
        await page.setRequestInterception(true);
        await page.setJavaScriptEnabled(false);
        page.on('request', req => {
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
class InputTextIntoSelectorWithInputNameOptions {
    constructor(inputName, text) {
        this.inputName = inputName;
        this.text = text;
    }
}
exports.InputTextIntoSelectorWithInputNameOptions = InputTextIntoSelectorWithInputNameOptions;
async function inputTextIntoSelectorWithInputName(page, options) {
    const { text, inputName } = options;
    console.log(`Inputting Text: ${text} for inputName: ${inputName}`);
    await page.evaluate((textToEvaluate) => {
        document.querySelector(`input[type=${inputName}]`).value = textToEvaluate;
    }, text);
}
exports.inputTextIntoSelectorWithInputName = inputTextIntoSelectorWithInputName;
var PuppeteerActionType;
(function (PuppeteerActionType) {
    PuppeteerActionType[PuppeteerActionType["WaitRandomAmountOfTimeBetween"] = 0] = "WaitRandomAmountOfTimeBetween";
    PuppeteerActionType[PuppeteerActionType["ScrollPageToEnd"] = 1] = "ScrollPageToEnd";
    PuppeteerActionType[PuppeteerActionType["ExtractHTMLFromPage"] = 2] = "ExtractHTMLFromPage";
    PuppeteerActionType[PuppeteerActionType["GetTextContentForSelector"] = 3] = "GetTextContentForSelector";
    PuppeteerActionType[PuppeteerActionType["GetValueForSelector"] = 4] = "GetValueForSelector";
    PuppeteerActionType[PuppeteerActionType["GetAnchorsForAllSelectors"] = 5] = "GetAnchorsForAllSelectors";
    PuppeteerActionType[PuppeteerActionType["WaitTillSelectorIsVisible"] = 6] = "WaitTillSelectorIsVisible";
    PuppeteerActionType[PuppeteerActionType["FindSelectorAndClick"] = 7] = "FindSelectorAndClick";
    PuppeteerActionType[PuppeteerActionType["GetPropertyValue"] = 8] = "GetPropertyValue";
    PuppeteerActionType[PuppeteerActionType["NavigatePageToURL"] = 9] = "NavigatePageToURL";
    PuppeteerActionType[PuppeteerActionType["InputTextIntoSelectorWithInputName"] = 10] = "InputTextIntoSelectorWithInputName";
})(PuppeteerActionType = exports.PuppeteerActionType || (exports.PuppeteerActionType = {}));
class PuppeteerActionBuilder {
    puppeteerActionFrom(page, action) {
        const { type, options } = action;
        switch (type) {
            case PuppeteerActionType.WaitRandomAmountOfTimeBetween:
                return () => waitRandomAmountOfTimeBetween(page, options);
            case PuppeteerActionType.ScrollPageToEnd:
                return () => scrollPageToEnd(page);
            case PuppeteerActionType.ExtractHTMLFromPage:
                return () => extractHTMLFromPage(page);
            case PuppeteerActionType.GetTextContentForSelector:
                return () => getTextContentForSelector(page, options);
            case PuppeteerActionType.GetValueForSelector:
                return () => getValueForSelector(page, options);
            case PuppeteerActionType.GetAnchorsForAllSelectors:
                return () => getAnchorsForAllSelectors(page, options);
            case PuppeteerActionType.WaitTillSelectorIsVisible:
                return () => waitTillSelectorIsVisible(page, options);
            case PuppeteerActionType.FindSelectorAndClick:
                return () => findSelectorAndClick(page, options);
            case PuppeteerActionType.GetPropertyValue:
                return () => getPropertyValue(page, options);
            case PuppeteerActionType.NavigatePageToURL:
                return () => navigatePageToURL(page, options);
            case PuppeteerActionType.InputTextIntoSelectorWithInputName:
                return () => inputTextIntoSelectorWithInputName(page, options);
        }
    }
}
exports.PuppeteerActionBuilder = PuppeteerActionBuilder;
class WaitRandomAmountOfTimeBetweenAction {
    constructor(min = 1000, max = 5000) {
        this.type = PuppeteerActionType.WaitRandomAmountOfTimeBetween;
        this.options = new WaitRandomTimeOptions(min, max);
    }
}
exports.WaitRandomAmountOfTimeBetweenAction = WaitRandomAmountOfTimeBetweenAction;
class ScrollPageToEndAction {
    constructor() {
        this.type = PuppeteerActionType.ScrollPageToEnd;
        this.options = new EmptyPuppeteerOptions();
    }
}
exports.ScrollPageToEndAction = ScrollPageToEndAction;
class ExtractHTMLFromPageAction {
    constructor() {
        this.type = PuppeteerActionType.ExtractHTMLFromPage;
        this.options = new EmptyPuppeteerOptions();
    }
}
exports.ExtractHTMLFromPageAction = ExtractHTMLFromPageAction;
class GetTextContentForSelectorAction {
    constructor(selector) {
        this.type = PuppeteerActionType.GetTextContentForSelector;
        this.options = new PuppeteerSelectorOptions(selector);
    }
}
exports.GetTextContentForSelectorAction = GetTextContentForSelectorAction;
class GetValueForSelectorAction {
    constructor(selector) {
        this.type = PuppeteerActionType.GetValueForSelector;
        this.options = new PuppeteerSelectorOptions(selector);
    }
}
exports.GetValueForSelectorAction = GetValueForSelectorAction;
class GetAnchorsForAllSelectorsAction {
    constructor(selector) {
        this.type = PuppeteerActionType.GetAnchorsForAllSelectors;
        this.options = new PuppeteerSelectorOptions(selector);
    }
}
exports.GetAnchorsForAllSelectorsAction = GetAnchorsForAllSelectorsAction;
class WaitTillSelectorIsVisibleAction {
    constructor(selector) {
        this.type = PuppeteerActionType.WaitTillSelectorIsVisible;
        this.options = new PuppeteerSelectorOptions(selector);
    }
}
exports.WaitTillSelectorIsVisibleAction = WaitTillSelectorIsVisibleAction;
class FindSelectorAndClickAction {
    constructor(selector) {
        this.type = PuppeteerActionType.FindSelectorAndClick;
        this.options = new PuppeteerSelectorOptions(selector);
    }
}
exports.FindSelectorAndClickAction = FindSelectorAndClickAction;
class GetPropertyValueAction {
    constructor(selector, property) {
        this.type = PuppeteerActionType.GetPropertyValue;
        this.options = new PuppeteerSelectorPropertyOptions(selector, property);
    }
}
exports.GetPropertyValueAction = GetPropertyValueAction;
class NavigatePageToURLAction {
    constructor(url, waitTimeout = 0, unloadAllExtras = false) {
        this.type = PuppeteerActionType.NavigatePageToURL;
        this.options = new NavigatePageToURLOptions(url, waitTimeout, unloadAllExtras);
    }
}
exports.NavigatePageToURLAction = NavigatePageToURLAction;
class InputTextIntoSelectorWithInputNamAction {
    constructor(inputName, text) {
        this.type = PuppeteerActionType.InputTextIntoSelectorWithInputName;
        this.options = new InputTextIntoSelectorWithInputNameOptions(inputName, text);
    }
}
exports.InputTextIntoSelectorWithInputNamAction = InputTextIntoSelectorWithInputNamAction;
//# sourceMappingURL=PuppeteerActions.js.map