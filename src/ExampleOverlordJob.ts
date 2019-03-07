import { DeferredPromise } from './DeferredPromise';
import { JobInterface, JobModel, JobResult } from './JobInterface';
import { ExampleMinionJobModel } from './ExampleMinionJob';
import v4 from 'uuid/v4';
import bull, { Queue, Job } from 'bull';
import { QueueExampleJobManager } from './JobManager';
import { QueueExampleMinionJobListener } from './JobListeners';

export enum ExampleOverlordJobType {
  Overlord1,
}

export class ExampleOverlordJobModel
  implements JobModel<ExampleOverlordJobType, ExampleOverlordJobResult> {
  constructor(
    public jobType: ExampleOverlordJobType,
    public jobDescription: string,
    public url: string,
    public minionJobs: ExampleMinionJobModel[],
    public result?: ExampleOverlordJobResult,
  ) {}
}

export class ExampleOverlordJobResult implements JobResult {
  constructor(
    public result: ExampleMinionJobModel[],
    public error?: Error,
    public failedMinionJobModel?: ExampleMinionJobModel,
  ) {}
}

export class ExampleOverlordJob
  implements
    JobInterface<
      ExampleOverlordJobResult,
      ExampleOverlordJobType,
      ExampleOverlordJobModel
    > {
  private queueManager: QueueExampleJobManager;
  public result: ExampleMinionJobModel[] = [];
  private deferredPromise = new DeferredPromise();
  private currentJob?: ExampleMinionJobModel;
  private minionJobs: ExampleMinionJobModel[];
  private queue: Queue;

  constructor(public job: ExampleOverlordJobModel) {
    // @TODO: find a way to pass in queue instead of create in init
    const overlordUUID = v4();
    const queue = new bull(overlordUUID);
    this.queue = queue;
    this.queueManager = new QueueExampleJobManager(queue);
    this.minionJobs = job.minionJobs;
    new QueueExampleMinionJobListener(
      queue,
      (job: Job, jobModel: ExampleMinionJobModel) => {
        this.handleResult(job, jobModel);
      },
      (error) => {
        this.handleError(error);
      },
    );
  }

  run(): Promise<ExampleOverlordJobModel> {
    this.startNextMinionJob();

    return this.deferredPromise.promise;
  }

  private startNextMinionJob() {
    if (this.minionJobs.length === 0) {
      this.complete();
      return;
    }
    const firstJob = this.minionJobs.shift();
    const newJobsArray = this.minionJobs.filter((_, i) => i !== 0);
    this.minionJobs = newJobsArray;
    this.currentJob = firstJob;
    this.queueManager.addJob(firstJob);
  }

  private complete(error?: Error, failedJob?: ExampleMinionJobModel) {
    console.log('completeing overlord job');
    this.queue.close();
    const finalResult = new ExampleOverlordJobResult(
      this.result,
      error,
      failedJob,
    );
    const final = new ExampleOverlordJobModel(
      this.job.jobType,
      this.job.jobDescription,
      this.job.url,
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

  private handleResult(job: Job, jobModel: ExampleMinionJobModel) {
    this.result.push(jobModel);
    this.startNextMinionJob();
  }

  private handleError(error: Error) {
    this.failWithError(error);
  }
}
