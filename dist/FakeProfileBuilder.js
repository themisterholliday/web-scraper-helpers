"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TempEmailGenerator_1 = require("./TempEmailGenerator");
const Profile_1 = require("./Profile");
const PuppeteerActions_1 = require("./PuppeteerActions");
const CheerioActions_1 = require("./CheerioActions");
class FakerJSGenerator {
    constructor() {
        this.faker = require('faker');
    }
    generatePassword() {
        return this.faker.internet.password(14);
    }
    generateFirstName() {
        return this.faker.name.firstName();
    }
    generateLastName() {
        return this.faker.name.lastName();
    }
    generateDateOfBirth() {
        return this.faker.date.past(40, '2000-01-01');
    }
    generateGender() {
        const randomBoolean = Math.random() >= 0.5;
        return randomBoolean ? 'f' : 'm';
    }
    generateBio() {
        return;
    }
    generateState() {
        return this.faker.address.state();
    }
}
class FakeProfileBuilder {
    static async buildProfile(fakeUserGenerator = new FakerJSGenerator(), emailGenerator = new TempEmailGenerator_1.TempEmailGenerator()) {
        const generatedEmail = await emailGenerator.createNewEmail();
        const email = generatedEmail.email;
        const emailUrl = generatedEmail.emailUrl;
        const password = fakeUserGenerator.generatePassword();
        const firstName = fakeUserGenerator.generatePassword();
        const lastName = fakeUserGenerator.generatePassword();
        const dateOfBirth = fakeUserGenerator.generateDateOfBirth();
        const gender = fakeUserGenerator.generateGender();
        const bio = await FakeProfileBuilder.buildBio();
        const state = fakeUserGenerator.generateState();
        return new Profile_1.Profile(email, emailUrl, password, firstName, lastName, dateOfBirth, gender, bio, state);
    }
    // @TODO: move
    static async buildBio() {
        const browser = await PuppeteerActions_1.createBrowser();
        const page = await PuppeteerActions_1.createPage(browser);
        const url = 'https://www.designskilz.com/random-users/';
        await PuppeteerActions_1.navigatePageToURL(page, url);
        const extract = await PuppeteerActions_1.extractHTMLFromPage(page);
        const text = CheerioActions_1.extractTextFromSelector(extract.html, '.bio .value');
        console.log(text);
        await PuppeteerActions_1.closeBrowser(browser);
        return '';
    }
}
exports.FakeProfileBuilder = FakeProfileBuilder;
(async () => {
    const obj = await FakeProfileBuilder.buildBio();
    console.log(JSON.stringify(obj, null, 2));
})();
//# sourceMappingURL=FakeProfileBuilder.js.map