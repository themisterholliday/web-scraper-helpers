"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GeneratedEmail_1 = require("./models/GeneratedEmail");
const puppeteerActions_1 = require("./puppeteerActions");
const CheerioActions_1 = require("./CheerioActions");
class TempEmailGenerator {
    async createNewEmail(page) {
        const emailUrl = TempEmailGenerator.TEMPEMAILURL;
        await puppeteerActions_1.navigatePageToURL(page, emailUrl);
        await puppeteerActions_1.waitTillSelectorIsVisible(page, '#mail');
        const extract = await puppeteerActions_1.extractHTMLFromPage(page);
        const email = CheerioActions_1.extractValueFromSelector(extract.html, '#mail');
        return new GeneratedEmail_1.GeneratedEmail(email, emailUrl);
    }
}
TempEmailGenerator.TEMPEMAILURL = 'https://temp-mail.org/en/';
exports.TempEmailGenerator = TempEmailGenerator;
//# sourceMappingURL=TempEmailGenerator.js.map