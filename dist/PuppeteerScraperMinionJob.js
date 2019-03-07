"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PuppeteerScraperMinionJobType;
(function (PuppeteerScraperMinionJobType) {
    PuppeteerScraperMinionJobType[PuppeteerScraperMinionJobType["Minion1"] = 0] = "Minion1";
})(PuppeteerScraperMinionJobType = exports.PuppeteerScraperMinionJobType || (exports.PuppeteerScraperMinionJobType = {}));
class PuppeteerScraperMinionJobModel {
    constructor(jobType, jobDescription, 
    // @TODO: make only puppeteer actions
    // @TODO: actions should be tied to job type
    action, result) {
        this.jobType = jobType;
        this.jobDescription = jobDescription;
        this.action = action;
        this.result = result;
    }
}
exports.PuppeteerScraperMinionJobModel = PuppeteerScraperMinionJobModel;
class PuppeteerScraperMinionJobResult {
    constructor(result) {
        this.result = result;
    }
}
exports.PuppeteerScraperMinionJobResult = PuppeteerScraperMinionJobResult;
class PuppeteerScraperMinionJob {
    constructor(job) {
        this.job = job;
    }
    async run() {
        const actionResult = await this.job.action;
        // @TODO: if action result use result
        const result = new PuppeteerScraperMinionJobResult(`Job completed: ${this.job.jobDescription}`);
        const finalJob = new PuppeteerScraperMinionJobModel(this.job.jobType, this.job.jobDescription, this.job.action, result);
        return finalJob;
    }
}
exports.PuppeteerScraperMinionJob = PuppeteerScraperMinionJob;
// const browser = await createBrowser();
// const page = await createPage(browser);
// new PuppeteerScraperMinionJobModel(
//   PuppeteerScraperMinionJobType.Minion1,
//   'JOB TYPE',
//   navigatePageToURL(page, 'url'),
// );
//# sourceMappingURL=PuppeteerScraperMinionJob.js.map