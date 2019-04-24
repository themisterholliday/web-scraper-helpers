import { Page } from 'puppeteer';
import { GeneratedEmail } from './models/GeneratedEmail';
import {
  navigatePageToURL,
  extractHTMLFromPage,
  waitTillSelectorIsVisible,
} from './PuppeteerActions';
import { extractValueFromSelector } from './CheerioActions';

export interface EmailGenerator {
  createNewEmail(page: Page): Promise<GeneratedEmail>;
}

export class TempEmailGenerator implements EmailGenerator {
  static TEMPEMAILURL: string = 'https://temp-mail.org/en/';

  async createNewEmail(page: Page): Promise<GeneratedEmail> {
    const emailUrl = TempEmailGenerator.TEMPEMAILURL;
    await navigatePageToURL(page, emailUrl);
    await waitTillSelectorIsVisible(page, '#mail');
    const extract = await extractHTMLFromPage(page);
    const email = extractValueFromSelector(extract.html, '#mail');
    return new GeneratedEmail(email, emailUrl);
  }
}
