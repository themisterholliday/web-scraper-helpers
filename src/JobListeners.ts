import { JobResult, JobModel } from './JobInterface';
import {
  ExampleOverlordJobModel,
  ExampleOverlordJobResult,
  ExampleOverlordJobType,
} from './ExampleOverlordJob';
import {
  ExampleMinionJobResult,
  ExampleMinionJobModel,
  ExampleMinionJobType,
} from './ExampleMinionJob';
import { Queue, Job } from 'bull';

interface MinionJobListener<
  Result extends JobResult,
  JobType,
  Model extends JobModel<JobType, Result>
> {
  jobResultCallback: (job: Job, jobModel: Model) => void;
  errorCallback: (error: Error) => void;
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
    public errorCallback: (error: Error) => void,
  ) {
    this.queue.on('completed', jobResultCallback).on('error', errorCallback);
  }
}

interface OverlordJobListener<
  Result extends JobResult,
  JobType,
  Model extends JobModel<JobType, Result>
> {
  jobResultCallback: (job: Job, jobModel: Model) => void;
  errorCallback: (jobModel: Model) => void;
}

export class QueueExampleOverlordJobListener
  implements
    OverlordJobListener<
      ExampleOverlordJobResult,
      ExampleOverlordJobType,
      ExampleOverlordJobModel
    > {
  constructor(
    private queue: Queue,
    public jobResultCallback: (
      job: Job,
      jobModel: ExampleOverlordJobModel,
    ) => void,
    public errorCallback: (jobModel: ExampleOverlordJobModel) => void,
  ) {
    this.queue.on('completed', jobResultCallback).on('error', errorCallback);
  }
}
