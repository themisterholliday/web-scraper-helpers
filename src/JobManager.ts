import { ExampleMinionJobModel } from './ExampleMinionJob';
import { Queue, Job } from 'bull';
import { ExampleMinionJobBuilder } from './JobBuilderInterface';

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
