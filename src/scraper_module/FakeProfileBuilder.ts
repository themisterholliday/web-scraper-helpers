import { Page } from 'puppeteer';
import { EmailGenerator, TempEmailGenerator } from './TempEmailGenerator';
import { Profile } from './models/Profile';
import { navigatePageToURL, extractHTMLFromPage } from './PuppeteerActions';
import { extractTextFromSelector } from './CheerioActions';

export interface FakeUserGenerator {
  generatePassword(): string;
  generateFirstName(): string;
  generateLastName(): string;
  generateDateOfBirth(): Date;
  generateGender(): string;
  generateState(): string;
}

class FakerJSGenerator implements FakeUserGenerator {
  private faker = require('faker');

  generatePassword(): string {
    return this.faker.internet.password(14);
  }

  generateFirstName(): string {
    return this.faker.name.firstName();
  }

  generateLastName(): string {
    return this.faker.name.lastName();
  }

  generateDateOfBirth(): Date {
    return this.faker.date.past(40, '2000-01-01');
  }

  generateGender(): string {
    const randomBoolean = Math.random() >= 0.5;
    return randomBoolean ? 'f' : 'm';
  }

  generateState(): string {
    return this.faker.address.state();
  }
}

export class FakeProfileBuilder {
  static async buildProfile(
    page: Page,
    fakeUserGenerator: FakeUserGenerator = new FakerJSGenerator(),
    emailGenerator: EmailGenerator = new TempEmailGenerator(),
  ): Promise<Profile> {
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
    return new Profile(
      email,
      emailUrl,
      password,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      bio,
      state,
    );
  }

  static async buildBio(page: Page): Promise<string> {
    const url = 'https://www.designskilz.com/random-users/';
    await navigatePageToURL(page, url);
    const extract = await extractHTMLFromPage(page);
    const bioText = extractTextFromSelector(extract.html, '.bio .value');
    return bioText;
  }
}
