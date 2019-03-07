export interface JobModel<JobType, Result extends JobResult> {
  jobType: JobType;
  jobDescription: string;
  result?: Result;
}

export interface JobResult {
  result: any;
}

export interface JobInterface<
  Results extends JobResult,
  JobType,
  Model extends JobModel<JobType, Results>
> {
  job: Model;
  run(): Promise<Model>;
}
