import { Page, Browser } from 'puppeteer';
import cheerio from 'cheerio';
import { Cluster } from 'puppeteer-cluster';
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
} from './PuppeteerAbstractMethods';
// import db from '../workout-database';
import '../lib/env';
import db from '../twitter-follower-scrapes-database';
import currentFollowingDB from '../twitter-current-following-database';

const twitterUsername = process.env.TWITTER_USERNAME;
const twitterPassword = process.env.TWITTER_PASSWORD;

async function twitterLogin(
  page: Page,
  username: string,
  password: string,
): Promise<void> {
  await navigatePageToURL(page, 'https://twitter.com/login');
  await inputTextIntoSelectorWithInputName(
    page,
    'session[username_or_email]',
    username,
  );
  const passwordSelector =
    '#page-container > div > div.signin-wrapper > form > fieldset > div:nth-child(3) > input';
  await typeTextIntoSelector(page, passwordSelector, password);

  await findSelectorAndClick(
    page,
    '#page-container > div > div.signin-wrapper > form > div.clearfix > button',
  );
  await page.waitForSelector('.alert-messages ', {
    hidden: true,
    timeout: 1000,
  });
  const appContentSelector =
    '#page-container > div.dashboard.dashboard-left > div.DashboardProfileCard.module';
  await waitTillSelectorIsVisible(page, appContentSelector);
}

async function getFollowersTwitterProfileLinksFromProfileURL(
  page: Page,
  url: string,
  maxScrapeCountDivisor: number = 1,
): Promise<string[]> {
  await navigatePageToURL(page, url);
  await waitTillSelectorIsVisible(page, '.ProfileNav-value');

  const followerCount = await getPropertyValue(
    page,
    '.ProfileNav-item--followers > .ProfileNav-stat > .ProfileNav-value',
    'data-count',
  );

  const followersURL = `${url}/followers`;
  await navigatePageToURL(page, followersURL);

  let data = [];
  const maxScrapeCount = parseInt(followerCount) / maxScrapeCountDivisor;
  console.log(`scraping followers with max scrape count of: ${maxScrapeCount}`);
  while (data.length !== maxScrapeCount) {
    console.log(`Current Data Length: ${data.length}`);
    await scrollPageToEnd(page);
    await waitRandomAmountOfTimeBetween(page, 1000, 2000);
    const { html } = await extractHTMLFromPage(page);
    const $ = cheerio.load(html);
    const userCollections = $('.GridTimeline-items').children();
    const profileURLs = $(userCollections)
      .map(function() {
        return $(this)
          .children()
          .map(function() {
            return $(this)
              .find('a')
              .attr('href');
          })
          .get();
      })
      .get();
    data = profileURLs;
  }
  console.log(`final scraped user count = ${data.length}`);
  const profileURLPrefix = 'https://twitter.com';
  const finalProfilesURLs = data.map(
    linkSuffix => `${profileURLPrefix}${linkSuffix}`,
  );
  return finalProfilesURLs;
}

// Following
async function switchFollowUserForURL(page: Page, url: string): Promise<void> {
  await navigatePageToURL(page, url);
  const followButtonSelector = '.user-actions-follow-button';
  await waitTillSelectorIsVisible(page, followButtonSelector);
  await waitRandomAmountOfTimeBetween(page, 60000, 70000);
  await findSelectorAndClick(page, followButtonSelector);
}

async function followUserForURL(page: Page, url: string): Promise<void> {
  console.log(`following user for url: ${url}`);
  await switchFollowUserForURL(page, url);
  // Validate is following
  const followSelector = '.user-actions.btn-group.following';
  await waitForSelector(page, followSelector, 2000);
}

async function unfollowUserForURL(page: Page, url: string): Promise<void> {
  console.log(`unfollowing user for url: ${url}`);
  await switchFollowUserForURL(page, url);
  // Validate did unfollow
  const followSelector = '.user-actions.btn-group.not-following';
  await waitForSelector(page, followSelector, 2000);
}

export async function setInitialFollowers(): Promise<void> {
  const { userProfile } = db.get('userProfiles').value()[0];
  const { followers } = userProfile;
  currentFollowingDB.set('followers', followers).write();
}

export async function runFollowerCron(): Promise<void> {
  const sliceCount = 50;
  const browser = await createBrowser(null);
  const page = await createPage(browser);

  await twitterLogin(page, twitterUsername, twitterPassword);

  const followers = currentFollowingDB.get('followers').value();
  const firstOneHundred = followers.slice(0, sliceCount);
  const erroredUrls: string[] = [];
  for (const url of firstOneHundred) {
    await followUserForURL(page, url).catch(() => {
      erroredUrls.push(url);
    });
  }

  const remainingFollowers = followers
    .slice(sliceCount + 1, followers.length)
    .concat(erroredUrls);
  currentFollowingDB.set('followers', remainingFollowers).write();
  await closeBrowser(browser);
}

(async () => {
  // const browser = await createBrowser(null);
  // const page = await createPage(browser);
  // await twitterLogin(
  //   'https://twitter.com/login',
  //   page,
  //   twitterUsername,
  //   twitterPassword,
  // );
  // const startingProfileLink = 'https://twitter.com/JavaScriptDaily';
  // const profileLinksArray = await getFollowersTwitterProfileLinksFromProfileURL(
  //   page,
  //   startingProfileLink,
  //   1,
  // );
  // const profile = {
  //   userProfile: {
  //     profileLink: startingProfileLink,
  //     followers: profileLinksArray,
  //   },
  // };
  // await closeBrowser(browser);
  // (db.get('userProfiles') as any).push(profile).write();
  await runFollowerCron();
})();
