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
//# sourceMappingURL=CheerioActions.js.map