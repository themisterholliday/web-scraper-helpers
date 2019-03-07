import { JobModel, JobInterface, JobResult } from './JobInterface';
import {
  navigatePageToURL,
  createBrowser,
  createPage,
} from './scraper_module/puppeteerActions';

export enum PuppeteerScraperMinionJobType {
  Minion1,
}

export class PuppeteerScraperMinionJobModel
  implements
    JobModel<PuppeteerScraperMinionJobType, PuppeteerScraperMinionJobResult> {
  constructor(
    public jobType: PuppeteerScraperMinionJobType,
    public jobDescription: string,
    // @TODO: make only puppeteer actions
    // @TODO: actions should be tied to job type
    public action: Promise<any>,
    public result?: PuppeteerScraperMinionJobResult,
  ) {}
}

export class PuppeteerScraperMinionJobResult implements JobResult {
  constructor(public result: any) {}
}

export class PuppeteerScraperMinionJob
  implements
    JobInterface<
      PuppeteerScraperMinionJobResult,
      PuppeteerScraperMinionJobType,
      PuppeteerScraperMinionJobModel
    > {
  constructor(public job: PuppeteerScraperMinionJobModel) {}

  public async run(): Promise<PuppeteerScraperMinionJobModel> {
    const actionResult = await this.job.action;
    // @TODO: if action result use result
    const result = new PuppeteerScraperMinionJobResult(
      `Job completed: ${this.job.jobDescription}`,
    );
    const finalJob = new PuppeteerScraperMinionJobModel(
      this.job.jobType,
      this.job.jobDescription,
      this.job.action,
      result,
    );
    return finalJob;
  }
}

// const browser = await createBrowser();
// const page = await createPage(browser);
// new PuppeteerScraperMinionJobModel(
//   PuppeteerScraperMinionJobType.Minion1,
//   'JOB TYPE',
//   navigatePageToURL(page, 'url'),
// );
