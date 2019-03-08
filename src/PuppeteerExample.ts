import {
  createBrowser,
  createPage,
  navigatePageToURL,
  closeBrowser,
  getTextContentForAllSelectors,
  getTextContentForSelector,
  waitTillSelectorIsVisible,
  waitRandomAmountOfTimeBetween,
} from './scraper_module/puppeteerActions';
import {
  PuppeteerScraperMinionJobModel,
  PuppeteerScraperOverlordJobModel,
  PuppeteerScraperOverlordJob,
  PuppeteerScraperOverlordJobListener,
} from './PuppeteerScraperMinionJob';
import { Job } from 'bull';
import bull = require('bull');

(async () => {
  const browser = await createBrowser();
  const page = await createPage(browser);

  const whatever6 = async () => {
    return new Promise(async (resolve) => {
      setTimeout(() => {
        console.log('test 1 done');
        resolve('done');
      },         6000);
    });
  };
  const whatever7 = async () => {
    return new Promise(async (resolve) => {
      console.log('test 2 started');
      await whatever6();
      console.log('test 2 done');
      resolve('done');
    });
  };
  console.log(whatever7);
  const one = new PuppeteerScraperMinionJobModel(
    'navigatePageToURL',
    0,
    // navigatePageToURL(page, 'https://en.wikipedia.org/wiki/Brie_Larson', 5000),
    whatever7,
  );
  //   const two = new PuppeteerScraperMinionJobModel(
  //     'getTextContentForSelector',
  //     2,
  //     getTextContentForSelector(page, 'p'),
  //   );

  const testQueue = new bull('test-queue');

  // @TODO: fix last in last out or whatever is going on here
  const minionJobs = [one];

  new PuppeteerScraperOverlordJobListener(
    testQueue,
    (job, jobModel) => {
      console.log(job.id, 'overlord job id');
      console.log(jobModel, 'completed overlord job model');
      console.log(jobModel.result, 'overlord job result');
      testQueue.close();
      page.screenshot({ path: 'screenshot.png' });
      //   closeBrowser(browser);
    },
    (jobModel) => {
      console.log(jobModel, 'failed overlord job');
      console.log(jobModel.result.error, 'failed overlord error');
      console.log(
        jobModel.result.failedMinionJobModel,
        'the failed minion job',
      );
      testQueue.close();
    },
  );

  // @TODO: use an overlord manager
  testQueue.process(async (job: Job) => {
    const jobData = <PuppeteerScraperOverlordJobModel>job.data;
    console.log(
      jobData.minionJobs.map((n) => {
        n.action;
      }),
    );
    const builtJob = new PuppeteerScraperOverlordJob(jobData);
    return builtJob.run().catch((error: Error) => {
      console.log('movedToFailed from overlord');
      job.moveToFailed({ message: error.message }, true);
    });
  });
  waitTillSelectorIsVisible;
  const overlordjob1 = new PuppeteerScraperOverlordJobModel(
    'Overlord Job 1 description',
    0,
    minionJobs,
  );
  testQueue.add(overlordjob1);
})();
