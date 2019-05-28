import chalk from 'chalk';

const log = (message: string): void => {
  console.log(chalk.redBright.bold(message));
  console.log('––––––––––––––––––––––');
};

export function logStartTime(functionTitle: string): number {
  const time = Date.now();
  log(`${functionTitle} started at ${time}`);
  return time;
}

export function logEndTime(functionTitle: string, startTime: number): number {
  const time = (Date.now() - startTime) / 1000;
  log(`${functionTitle} ended at ${time}`);
  return time;
}
