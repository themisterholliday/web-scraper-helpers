import {
  createBrowser,
  createPage,
  closeBrowser,
  waitRandomAmountOfTimeBetween,
  scrollPageToEnd,
  scrollPageToEndForCount,
  extractHTMLFromPage,
  getTextContentForSelector,
  getValueForSelector,
  getTextContentForAllSelectors,
  getAnchorsForAllSelectors,
  waitForSelector,
  waitTillSelectorIsVisible,
  findSelectorAndClick,
  getPropertyValue,
  navigatePageToURL,
  inputTextIntoSelectorWithInputName,
  typeTextIntoSelector,
} from './scraper_module/PuppeteerAbstractMethods';

(async () => {
  const browser = await createBrowser(null);
  const page = await createPage(browser);
  page.on('response', response => {
    if (response.url().endsWith('/marketing-banners')) {
      console.log('response code: ', response.status());
      response.json().then(test => console.log(test));
    }
  });
  await navigatePageToURL(page, 'https://www.roosterteeth.com');
  await waitRandomAmountOfTimeBetween(page, 50000, 100000);
  await closeBrowser(browser);
})();
