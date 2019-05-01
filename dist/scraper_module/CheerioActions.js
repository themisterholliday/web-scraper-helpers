"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio_1 = __importDefault(require("cheerio"));
function extractTextFromSelector(html, selector) {
    console.log(`Extracting Text from selector ${selector}`);
    const $ = cheerio_1.default.load(html);
    return $(selector).text();
}
exports.extractTextFromSelector = extractTextFromSelector;
function extractValueFromSelector(html, selector) {
    console.log(`Extracting Value from selector ${selector}`);
    const $ = cheerio_1.default.load(html);
    return $(selector).val();
}
exports.extractValueFromSelector = extractValueFromSelector;
function getAllLinks(html) {
    const $ = cheerio_1.default.load(html);
    const links = $('a');
    const finalLinks = $(links)
        .map((_, link) => $(link).attr('data-profileid'))
        .get();
    return finalLinks;
}
exports.getAllLinks = getAllLinks;
function getTextFromElementContainingString(html, string) {
    const $ = cheerio_1.default.load(html);
    return $(`span:contains(${string})`).text();
}
exports.getTextFromElementContainingString = getTextFromElementContainingString;
function getTextFromElementAfterElementContainingString(html, string) {
    const $ = cheerio_1.default.load(html);
    return $(`span:contains(${string})`)
        .next()
        .text();
}
exports.getTextFromElementAfterElementContainingString = getTextFromElementAfterElementContainingString;
//# sourceMappingURL=CheerioActions.js.map