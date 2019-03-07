import { JobModel, JobInterface, JobResult } from './JobInterface';

export enum ExampleMinionJobType {
  Minion1,
}

export class ExampleMinionJobModel
  implements JobModel<ExampleMinionJobType, ExampleMinionJobResult> {
  constructor(
    public jobType: ExampleMinionJobType,
    public jobDescription: string,
    public url: string,
    public result?: ExampleMinionJobResult,
  ) {}
}

export class ExampleMinionJobResult implements JobResult {
  constructor(public result: any) {}
}

export class ExampleMinionJob
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
