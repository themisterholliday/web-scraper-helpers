import bull, { Queue, Job } from 'bull';
import v4 from 'uuid/v4';

export enum ExampleMinionJobType {
  Minion1,
}

export enum ExampleOverlordJobType {
  Overlord1,
}

interface JobModel<JobType, Result extends JobResult> {
  jobType: JobType;
  jobDescription: string;
  result?: Result;
}

class ExampleMinionJobModel
  implements JobModel<ExampleMinionJobType, ExampleMinionJobResult> {
  constructor(
    public jobType: ExampleMinionJobType,
    public jobDescription: string,
    public url: string,
    public result?: ExampleMinionJobResult,
  ) {}
}

class ExampleOverlordJobModel
  implements JobModel<ExampleOverlordJobType, ExampleOverlordJobResult> {
  constructor(
    public jobType: ExampleOverlordJobType,
    public jobDescription: string,
    public url: string,
    public minionJobs: ExampleMinionJobModel[],
    public result?: ExampleOverlordJobResult,
  ) {}
}

interface JobResult {
  result: any;
}

class ExampleMinionJobResult implements JobResult {
  constructor(public result: any) {}
}

class ExampleOverlordJobResult implements JobResult {
  constructor(public result: ExampleMinionJobModel[]) {}
}

interface JobInterface<
  Results extends JobResult,
  JobType,
  Model extends JobModel<JobType, Results>
> {
  job: Model;
  run(): Promise<Model>;
}

class ExampleMinionJob
  implements
    JobInterface<
      ExampleMinionJobResult,
      ExampleMinionJobType,
      ExampleMinionJobModel
    > {
  constructor(public job: ExampleMinionJobModel) {}

  public run(): Promise<ExampleMinionJobModel> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = new ExampleMinionJobResult(
          `Job 1 complete for url: ${this.job.url}`,
        );
        const finalJob = new ExampleMinionJobModel(
          this.job.jobType,
          this.job.jobDescription,
          this.job.url,
          result,
        );
        resolve(finalJob);
      },         1000);
    });
  }
}

interface JobBuilder<
  Result extends JobResult,
  JobType,
  Model extends JobModel<JobType, Result>,
  Minion extends JobInterface<Result, JobType, Model>
> {
  build(job: Model): Minion;
}

export class ExampleMinionJobBuilder
  implements
    JobBuilder<
      ExampleOverlordJobResult,
      ExampleMinionJobType,
      ExampleMinionJobModel,
      ExampleMinionJob
    > {
  build(job: ExampleMinionJobModel): ExampleMinionJob {
    switch (job.jobType) {
      case ExampleMinionJobType.Minion1:
        return new ExampleMinionJob(job);
    }
  }
}

export class ExampleOverlordJobBuilder
  implements
    JobBuilder<
      ExampleOverlordJobResult,
      ExampleOverlordJobType,
      ExampleOverlordJobModel,
      ExampleOverlordJob
    > {
  build(job: ExampleOverlordJobModel): ExampleOverlordJob {
    switch (job.jobType) {
      case ExampleOverlordJobType.Overlord1:
        return new ExampleOverlordJob(job);
    }
  }
}

export class QueueExampleJobManager {
  constructor(private queue: Queue) {
    // Job Consumer
    queue.process(async (job: Job) => {
      const builtJob = new ExampleMinionJobBuilder().build(job.data);
      return builtJob.run().catch((error: Error) => {
        job.moveToFailed({ message: error.message }, true);
      });
    });
  }

  // Job Producer
  addJob(job: ExampleMinionJobModel) {
    this.queue.add(job);
  }
}

type ErrorCallback = (error: Error) => void;

interface MinionJobListener<
  Result extends JobResult,
  JobType,
  Model extends JobModel<JobType, Result>
> {
  jobResultCallback: (job: Job, jobModel: Model) => void;
  errorCallback: ErrorCallback;
}

export class QueueExampleMinionJobListener
  implements
    MinionJobListener<
      ExampleMinionJobResult,
      ExampleMinionJobType,
      ExampleMinionJobModel
    > {
  constructor(
    private queue: Queue,
    public jobResultCallback: (
      job: Job,
      jobModel: ExampleMinionJobModel,
    ) => void,
    public errorCallback: ErrorCallback,
  ) {
    this.queue.on('completed', jobResultCallback).on('error', errorCallback);
  }
}

interface OverlordJobListener<
  Result extends JobResult,
  JobType,
  Model extends JobModel<JobType, Result>
> {
  jobResultCallback: (job: Job, jobModel: Model[]) => void;
  errorCallback: ErrorCallback;
}

export class QueueExampleOverlordJobListener
  implements
    OverlordJobListener<
      ExampleMinionJobResult,
      ExampleMinionJobType,
      ExampleMinionJobModel
    > {
  constructor(
    private queue: Queue,
    public jobResultCallback: (
      job: Job,
      jobModel: ExampleMinionJobModel[],
    ) => void,
    public errorCallback: ErrorCallback,
  ) {
    this.queue.on('completed', jobResultCallback).on('error', errorCallback);
  }
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
    // @TODO: find a way to init queue For some reason not working when initing
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

  private complete() {
    console.log('completeing overlord job');
    this.queue.close();
    const finalResult = new ExampleOverlordJobResult(this.result);
    const final = new ExampleOverlordJobModel(
      this.job.jobType,
      this.job.jobDescription,
      this.job.url,
      this.job.minionJobs,
      finalResult,
    );
    this.deferredPromise.resolve(final);
  }

  private failWithError(error: Error) {
    // @TODO: find a good way to pass the current job that errored here
    this.deferredPromise.reject(error);
  }

  private handleResult(job: Job, jobModel: ExampleMinionJobModel) {
    this.result.push(jobModel);
    this.startNextMinionJob();
  }

  private handleError(error: Error) {
    this.failWithError(error);
  }
}

class DeferredPromise {
  public promise: Promise<any>;
  public resolve: (value?: any) => void;
  public reject: (reason?: any) => void;

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

function run() {
  const testQueue = new bull('test-queue');

  const startURL = 'URL.com';
  const job1 = new ExampleMinionJobModel(
    ExampleMinionJobType.Minion1,
    'Job 1 description',
    startURL,
  );

  const minionJobs = [job1, job1, job1];

  new QueueExampleOverlordJobListener(
    testQueue,
    (job, result) => {
      console.log(job.id, 'overlord job id');
      console.log(result, 'overlord results');
      testQueue.close();
    },
    (error) => {
      console.log(error, 'error here');
      testQueue.close();
    },
  );

  // @TODO: use an overlord manager
  testQueue.process(async (job: Job) => {
    const jobData = <ExampleOverlordJobModel>job.data;
    const builtJob = new ExampleOverlordJobBuilder().build(jobData);
    return builtJob.run().catch((error: Error) => {
      console.log('movedToFailed from overlord');
      job.moveToFailed({ message: error.message }, true);
    });
  });

  const overlordjob1 = new ExampleOverlordJobModel(
    ExampleOverlordJobType.Overlord1,
    'Overlord Job 1 description',
    'url or whatever needed',
    minionJobs,
  );
  testQueue.add(overlordjob1);
}

run();
