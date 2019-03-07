import { ExampleMinionJobModel, ExampleMinionJob } from './ExampleMinionJob';
import { Queue, Job } from 'bull';

export class QueueExampleJobManager {
  constructor(private queue: Queue) {
    // Job Consumer
    queue.process(async (job: Job) => {
      const builtJob = new ExampleMinionJob(job.data);
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
