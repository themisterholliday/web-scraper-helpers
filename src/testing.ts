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
} from './scraper_module/PuppeteerHelper';

(async () => {
  const browser = await createBrowser(null);
  const page = await createPage(browser);
  page.on('response', response => {
    const url = response.url();
    const twitterURL = 'api.twitter.com';
    if (!url.includes(twitterURL)) {
      return;
    }
    if (url.includes('UserByScreenName')) {
      console.log('response code: ', response.status());
      response.json().then(test => {
        const { rest_id: restId } = test;
        console.log(restId, '–––––––––––––––––');
      });
    }
  });
  await navigatePageToURL(page, 'https://twitter.com/JamesWillems');
  await waitRandomAmountOfTimeBetween(page, 50000, 100000);
  await closeBrowser(browser);
})();
