import { JobResult, JobModel, JobInterface } from './JobInterface';
import {
  ExampleOverlordJob,
  ExampleOverlordJobResult,
  ExampleOverlordJobType,
  ExampleOverlordJobModel,
} from './ExampleOverlordJob';
import {
  ExampleMinionJobType,
  ExampleMinionJobModel,
  ExampleMinionJob,
} from './ExampleMinionJob';
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
