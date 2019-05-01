import { Page } from 'puppeteer';
import faker from 'faker';
import { EmailGenerator /*TempEmailGenerator */ } from './TempEmailGenerator';
import { Profile } from './models/Profile';
import { navigatePageToURL, extractHTMLFromPage } from './PuppeteerActions';
import { extractTextFromSelector } from './CheerioActions';

export interface FakeUserGenerator {
  generatePassword(): string;
  generateFirstName(): string;
  generateLastName(): string;
  generateDateOfBirth(): Date;
  generateState(): string;
}

class FakerJSGenerator implements FakeUserGenerator {
  private faker = faker;

  public generatePassword(): string {
    return this.faker.internet.password(14);
  }

  public generateFirstName(): string {
    return this.faker.name.firstName();
  }

  public generateLastName(): string {
    return this.faker.name.lastName();
  }

  public generateDateOfBirth(): Date {
    return this.faker.date.past(40, '2000-01-01');
  }

  public static generateGender(): string {
    const randomBoolean = Math.random() >= 0.5;
    return randomBoolean ? 'f' : 'm';
  }

  public generateState(): string {
    return this.faker.address.state();
  }
}

// export class FakeProfileBuilder {
//   public static async buildProfile(
//     page: Page,
//     fakeUserGenerator: FakeUserGenerator = new FakerJSGenerator(),
//     emailGenerator: EmailGenerator = new TempEmailGenerator(),
//   ): Promise<Profile> {
//     const generatedEmail = await emailGenerator.createNewEmail(page);
//     const { email } = generatedEmail;
//     const { emailUrl } = generatedEmail;
//     const password = fakeUserGenerator.generatePassword();
//     const firstName = fakeUserGenerator.generatePassword();
//     const lastName = fakeUserGenerator.generatePassword();
//     const dateOfBirth = fakeUserGenerator.generateDateOfBirth();
//     const gender = FakerJSGenerator.generateGender();
//     const bio = await FakeProfileBuilder.buildBio(page);
//     const state = fakeUserGenerator.generateState();
//     return new Profile(
//       email,
//       emailUrl,
//       password,
//       firstName,
//       lastName,
//       dateOfBirth,
//       gender,
//       bio,
//       state,
//     );
//   }

// public static async buildBio(page: Page): Promise<string> {
//   const url = 'https://www.designskilz.com/random-users/';
//   await navigatePageToURL(page, url);
//   const extract = await extractHTMLFromPage(page);
//   const bioText = extractTextFromSelector(extract.html, '.bio .value');
//   return bioText;
// }
// }
