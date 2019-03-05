"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TempEmailGenerator_1 = require("./TempEmailGenerator");
const Profile_1 = require("./models/Profile");
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
    generateState() {
        return this.faker.address.state();
    }
}
class FakeProfileBuilder {
    static async buildProfile(page, fakeUserGenerator = new FakerJSGenerator(), emailGenerator = new TempEmailGenerator_1.TempEmailGenerator()) {
        const generatedEmail = await emailGenerator.createNewEmail(page);
        const email = generatedEmail.email;
        const emailUrl = generatedEmail.emailUrl;
        const password = fakeUserGenerator.generatePassword();
        const firstName = fakeUserGenerator.generatePassword();
        const lastName = fakeUserGenerator.generatePassword();
        const dateOfBirth = fakeUserGenerator.generateDateOfBirth();
        const gender = fakeUserGenerator.generateGender();
        const bio = await FakeProfileBuilder.buildBio(page);
        const state = fakeUserGenerator.generateState();
        return new Profile_1.Profile(email, emailUrl, password, firstName, lastName, dateOfBirth, gender, bio, state);
    }
    static async buildBio(page) {
        const url = 'https://www.designskilz.com/random-users/';
        await PuppeteerActions_1.navigatePageToURL(page, url);
        const extract = await PuppeteerActions_1.extractHTMLFromPage(page);
        const bioText = CheerioActions_1.extractTextFromSelector(extract.html, '.bio .value');
        return bioText;
    }
}
exports.FakeProfileBuilder = FakeProfileBuilder;
//# sourceMappingURL=FakeProfileBuilder.js.map