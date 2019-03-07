import bull, { Job } from 'bull';
import {
  ExampleMinionJobType,
  ExampleMinionJobModel,
} from './ExampleMinionJob';
import { QueueExampleOverlordJobListener } from './JobListeners';
import {
  ExampleOverlordJobModel,
  ExampleOverlordJobType,
} from './ExampleOverlordJob';
import { ExampleOverlordJobBuilder } from './JobBuilderInterface';

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
    (job, jobModel) => {
      console.log(job.id, 'overlord job id');
      console.log(jobModel, 'completed overlord job model');
      console.log(jobModel.result, 'overlord job result');
      testQueue.close();
    },
    (jobModel) => {
      console.log(jobModel, 'failed overlord job');
      console.log(jobModel.result.error, 'failed overlord error');
      console.log(
        jobModel.result.failedMinionJobModel,
        'the failed minion job',
      );
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
