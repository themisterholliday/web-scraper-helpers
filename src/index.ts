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
import {
  cacheHTMLForURL,
  getHTMLCacheForURL,
} from './scraper_module/HTMLCacheHelper';

export {
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
  cacheHTMLForURL,
  getHTMLCacheForURL,
};
