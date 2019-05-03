import { Page, Browser } from 'puppeteer';
import {
  createBrowser,
  createPage,
  waitRandomAmountOfTimeBetween,
  scrollPageToEnd,
  extractHTMLFromPage,
  getTextContentForSelector,
  getValueForSelector,
  getAnchorsForAllSelectors,
  waitTillSelectorIsVisible,
  findSelectorAndClick,
  getPropertyValue,
  navigatePageToURL,
  inputTextIntoSelectorWithInputName,
  PuppeteerOptions,
  EmptyPuppeteerOptions,
  WaitRandomTimeOptions,
  PuppeteerSelectorOptions,
  PuppeteerSelectorPropertyOptions,
  NavigatePageToURLOptions,
  InputTextIntoSelectorWithInputNameOptions,
  closeBrowser,
} from '../scraper_module/PuppeteerAbstractMethods';
import {
  getProxiesFromTable,
  getAllLinks,
} from '../scraper_module/CheerioActions';

interface Proxy {
  ipAddress: string;
  port: string;
}

async function proxiesFromURL(url: string, page: Page): Promise<Proxy[]> {
  await navigatePageToURL(page, new NavigatePageToURLOptions(url));
  const html = await extractHTMLFromPage(page);
  return (await getProxiesFromTable(html.html)) as Proxy[];
}

export async function fetchProxies(): Promise<Proxy[]> {
  const startURL =
    'https://www.cool-proxy.net/proxies/http_proxy_list/sort:score/direction:desc/country_code:us/port:/anonymous:1';

  const browser = await createBrowser();
  const page = await createPage(browser);

  await navigatePageToURL(page, new NavigatePageToURLOptions(startURL));
  const html = await extractHTMLFromPage(page);
  const firstProxies = (await getProxiesFromTable(html.html)) as Proxy[];

  const pageCount = 3;
  const links = await getAllLinks(html.html)
    .filter(link => link.includes('/page:'))
    .filter(link => {
      const pageString = 'page:';
      const pageNumberString = link.substring(
        link.lastIndexOf(pageString) + pageString.length,
        link.length,
      );
      const pageNumber = parseInt(pageNumberString);
      return pageNumber <= pageCount;
    })
    .map(link => `https://www.cool-proxy.net${link}`);

  const allProxies: Proxy[] = [...firstProxies];
  for (const link of links) {
    const proxies = await proxiesFromURL(link, page);
    allProxies.push(...proxies);
  }

  await closeBrowser(browser);
  return allProxies;
}
