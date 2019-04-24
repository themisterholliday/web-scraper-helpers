import { JobResult } from './JobInterface';
export interface JobModel<Result extends JobResult> {
  jobDescription: string;
  result?: Result;
}

export interface JobResult {
  result: any;
}

export interface JobInterface<
  Results extends JobResult,
  Model extends JobModel<Results>
> {
  job: Model;
  run(): Promise<Model>;
}
