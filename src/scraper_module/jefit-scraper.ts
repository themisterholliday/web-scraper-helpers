import { Page, Browser } from 'puppeteer';
import cheerio from 'cheerio';
import { Cluster } from 'puppeteer-cluster';
import {
  createBrowser,
  createPage,
  closeBrowser,
  waitRandomAmountOfTimeBetween,
  scrollPageToEnd,
  extractHTMLFromPage,
  getTextContentForSelector,
  getValueForSelector,
  getTextContentForAllSelectors,
  getAnchorsForAllSelectors,
  waitTillSelectorIsVisible,
  findSelectorAndClick,
  getPropertyValue,
  navigatePageToURL,
  inputTextIntoSelectorWithInputName,
} from '../scraper_module/PuppeteerAbstractMethods';
import db from '../workout-database';

const baseDetailUrl = 'https://www.jefit.com/exercises/';

export async function getWorkoutsForUrl(
  url: string,
  page: Page,
): Promise<{ link: string }[]> {
  await navigatePageToURL(page, url);
  const websiteResponse = await extractHTMLFromPage(page);
  const middleSelector = '#hor-minimalist_3 > tbody > tr > td > table > tbody';

  const $ = cheerio.load(websiteResponse.html);
  const proxies: { link: string }[] = $(middleSelector)
    .children()
    .map((index: number, tr: CheerioElement) => {
      const link = $('a', tr).attr('href');
      const finalLink = `${baseDetailUrl}${link}`;
      return { finalLink };
    })
    .get();

  return proxies;
}

const baseUrl =
  'https://www.jefit.com/exercises/bodypart.php?id=11&exercises=All&All=0&Bands=0&Bench=0&Dumbbell=0&EZBar=0&Kettlebell=0&MachineStrength=0&MachineCardio=0&Barbell=0&BodyOnly=0&ExerciseBall=0&FoamRoll=0&PullBar=0&WeightPlate=0&Other=0&Strength=0&Stretching=0&Powerlifting=0&OlympicWeightLifting=0&Beginner=0&Intermediate=0&Expert=0&page=';

async function loopThroughAllPages(): Promise<{ link: string }[]> {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 10,
  });
  let allUrls: { link: string }[] = [];
  await cluster.task(async ({ page, data: url }) => {
    const urls = await getWorkoutsForUrl(url, page);
    allUrls = [...allUrls, ...urls];
  });

  const rangeOfNumbers = [...Array(130).keys()];
  rangeOfNumbers.forEach(item => {
    const finalUrl = `${baseUrl}${item + 1}`;
    cluster.queue(finalUrl);
  });

  await cluster.idle();
  await cluster.close();
  return allUrls;
}

(async () => {
  const finalUrls = await loopThroughAllPages();
  console.log(finalUrls.length);
  (db.get('workouts') as any).push(finalUrls).write();
})();
