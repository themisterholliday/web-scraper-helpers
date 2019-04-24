"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function extractTextFromSelector(html, selector) {
    console.log(`Extracting Text from selector ${selector}`);
    const cheerio = require('cheerio');
    const $ = cheerio.load(html);
    return $(selector).text();
}
exports.extractTextFromSelector = extractTextFromSelector;
function extractValueFromSelector(html, selector) {
    console.log(`Extracting Value from selector ${selector}`);
    const cheerio = require('cheerio');
    const $ = cheerio.load(html);
    return $(selector).val();
}
exports.extractValueFromSelector = extractValueFromSelector;
function getAllLinks(html) {
    const cheerio = require('cheerio');
    const $ = cheerio.load(html);
    const links = $('a');
    const finalLinks = [];
    $(links).each((_, link) => {
        const href = $(link).attr('href');
        finalLinks.push(href);
    });
    return finalLinks;
}
exports.getAllLinks = getAllLinks;
function getTextFromElementContainingString(html, string) {
    const cheerio = require('cheerio');
    const $ = cheerio.load(html);
    return $(`span:contains(${string})`).text();
}
exports.getTextFromElementContainingString = getTextFromElementContainingString;
function getTextFromElementAfterElementContainingString(html, string) {
    const cheerio = require('cheerio');
    const $ = cheerio.load(html);
    return $(`span:contains(${string})`)
        .next()
        .text();
}
exports.getTextFromElementAfterElementContainingString = getTextFromElementAfterElementContainingString;
//# sourceMappingURL=CheerioActions.js.map