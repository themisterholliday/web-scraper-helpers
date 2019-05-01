"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = __importDefault(require("faker"));
class FakerJSGenerator {
    constructor() {
        this.faker = faker_1.default;
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
    static generateGender() {
        const randomBoolean = Math.random() >= 0.5;
        return randomBoolean ? 'f' : 'm';
    }
    generateState() {
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
//# sourceMappingURL=FakeProfileBuilder.js.map