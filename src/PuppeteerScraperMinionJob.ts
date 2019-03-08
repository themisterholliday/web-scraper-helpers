import { JobModel, JobInterface, JobResult } from './JobInterface';
import { Queue, Job } from 'bull';
import bull = require('bull');
import { DeferredPromise } from './DeferredPromise';
import { v4 } from 'uuid';
import { MinionJobListener, OverlordJobListener } from './JobListeners';

export class PuppeteerScraperMinionJobModel
  implements JobModel<PuppeteerScraperMinionJobResult> {
  constructor(
    public jobDescription: string,
    public action: () => Promise<any>,
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
      PuppeteerScraperMinionJobModel
    > {
  constructor(public job: PuppeteerScraperMinionJobModel) {
    console.log(this.job.action, 'here');
  }

  public async run(): Promise<PuppeteerScraperMinionJobModel> {
    console.log(`Running Job: ${this.job.jobDescription}`);
    console.log(this.job.action);
    const actionResult = await this.job.action();
    console.log(actionResult, 'action result');
    let result: any = `Job Completed: ${this.job.jobDescription}`;
    if (actionResult != null && actionResult !== undefined) {
      result = actionResult;
    }

    const finalResult = new PuppeteerScraperMinionJobResult(result);
    const finalJob = new PuppeteerScraperMinionJobModel(
      this.job.jobDescription,
      this.job.action,
      finalResult,
    );
    console.log(`Completing Job: ${this.job.jobDescription}`);
    return finalJob;
  }
}

export class PuppeteerScraperOverlordJobModel
  implements JobModel<PuppeteerScraperOverlordJobResult> {
  constructor(
    public jobDescription: string,
    public orderNumber: number,
    public minionJobs: PuppeteerScraperMinionJobModel[],
    public result?: PuppeteerScraperOverlordJobResult,
  ) {}
}
// ------------------------------------------------------------------------------
export class PuppeteerScraperOverlordJobListener
  implements
    OverlordJobListener<
      PuppeteerScraperOverlordJobResult,
      PuppeteerScraperOverlordJobModel
    > {
  constructor(
    private queue: Queue,
    public jobResultCallback: (
      job: Job,
      jobModel: PuppeteerScraperOverlordJobModel,
    ) => void,
    public errorCallback: (jobModel: PuppeteerScraperOverlordJobModel) => void,
  ) {
    this.queue.on('completed', jobResultCallback).on('error', errorCallback);
  }
}

export class PuppeteerScraperMinionJobListener
  implements
    MinionJobListener<
      PuppeteerScraperMinionJobResult,
      PuppeteerScraperMinionJobModel
    > {
  constructor(
    private queue: Queue,
    public jobResultCallback: (
      job: Job,
      jobModel: PuppeteerScraperMinionJobModel,
    ) => void,
    public errorCallback: (error: Error) => void,
  ) {
    this.queue.on('completed', jobResultCallback).on('error', errorCallback);
  }
}

export class PuppeteerScraperJobManager {
  constructor(private queue: Queue) {
    // Job Consumer
    queue.process(async (job: Job) => {
      const builtJob = new PuppeteerScraperMinionJob(job.data);
      return builtJob.run().catch((error: Error) => {
        job.moveToFailed({ message: error.message }, true);
      });
    });
  }

  // Job Producer
  addJob(job: PuppeteerScraperMinionJobModel) {
    console.log(`Add job to overlord ${job.jobDescription}`);
    this.queue.add(job);
  }
}

export class PuppeteerScraperOverlordJobResult implements JobResult {
  constructor(
    public result: PuppeteerScraperMinionJobModel[],
    public error?: Error,
    public failedMinionJobModel?: PuppeteerScraperMinionJobModel,
  ) {}
}

export class PuppeteerScraperOverlordJob
  implements
    JobInterface<
      PuppeteerScraperOverlordJobResult,
      PuppeteerScraperOverlordJobModel
    > {
  private queueManager: PuppeteerScraperJobManager;
  public result: PuppeteerScraperMinionJobModel[] = [];
  private deferredPromise = new DeferredPromise();
  private currentJob?: PuppeteerScraperMinionJobModel;
  private currentMinionJobs: PuppeteerScraperMinionJobModel[];
  private minionJobs: PuppeteerScraperMinionJobModel[];
  private queue: Queue;
  public orderNumber: number;

  constructor(public job: PuppeteerScraperOverlordJobModel) {
    // @TODO: find a way to pass in queue instead of create in init
    const overlordUUID = v4();
    const queue = new bull(overlordUUID);
    this.orderNumber = job.orderNumber;
    this.queue = queue;
    this.queueManager = new PuppeteerScraperJobManager(queue);
    this.minionJobs = job.minionJobs;
    new PuppeteerScraperMinionJobListener(
      queue,
      (job: Job, jobModel: PuppeteerScraperMinionJobModel) => {
        this.handleResult(job, jobModel);
      },
      (error) => {
        this.handleError(error);
      },
    );
  }

  run(): Promise<PuppeteerScraperOverlordJobModel> {
    console.log(`Started running Overlord Job: ${this.job.jobDescription}`);

    const firstJob = this.minionJobs.shift();
    const newJobsArray = this.minionJobs;
    this.currentMinionJobs = newJobsArray;
    this.currentJob = firstJob;
    this.queueManager.addJob(this.currentJob);

    return this.deferredPromise.promise;
  }

  private startNextMinionJob() {
    if (this.currentMinionJobs.length === 0) {
      this.complete();
      return;
    }
    const firstJob = this.currentMinionJobs.shift();
    const newJobsArray = this.currentMinionJobs;
    this.currentMinionJobs = newJobsArray;
    this.currentJob = firstJob;
    this.queueManager.addJob(this.currentJob);
  }

  private complete(error?: Error, failedJob?: PuppeteerScraperMinionJobModel) {
    console.log('completeing overlord job');
    this.queue.close();
    const finalResult = new PuppeteerScraperOverlordJobResult(
      this.result,
      error,
      failedJob,
    );
    const final = new PuppeteerScraperOverlordJobModel(
      this.job.jobDescription,
      this.job.orderNumber,
      this.job.minionJobs,
      finalResult,
    );
    if (error != null) {
      this.deferredPromise.reject(final);
      return;
    }
    this.deferredPromise.resolve(final);
  }

  private failWithError(error: Error) {
    this.complete(error, this.currentJob);
  }

  private handleResult(job: Job, jobModel: PuppeteerScraperMinionJobModel) {
    this.result.push(jobModel);
    this.startNextMinionJob();
  }

  private handleError(error: Error) {
    this.failWithError(error);
  }
}
