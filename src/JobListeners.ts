import { JobResult, JobModel } from './JobInterface';
import {
  ExampleOverlordJobModel,
  ExampleOverlordJobResult,
} from './ExampleOverlordJob';
import {
  ExampleMinionJobResult,
  ExampleMinionJobModel,
} from './ExampleMinionJob';
import { Queue, Job } from 'bull';

interface MinionJobListener<
  Result extends JobResult,
  Model extends JobModel<Result>
> {
  jobResultCallback: (job: Job, jobModel: Model) => void;
  errorCallback: (error: Error) => void;
}

export class QueueExampleMinionJobListener
  implements MinionJobListener<ExampleMinionJobResult, ExampleMinionJobModel> {
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
  Model extends JobModel<Result>
> {
  jobResultCallback: (job: Job, jobModel: Model) => void;
  errorCallback: (jobModel: Model) => void;
}

export class QueueExampleOverlordJobListener
  implements
    OverlordJobListener<ExampleOverlordJobResult, ExampleOverlordJobModel> {
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
