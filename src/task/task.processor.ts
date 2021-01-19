import {
  InjectQueue,
  OnQueueActive,
  OnQueueCleaned,
  OnQueueCompleted,
  OnQueueDrained,
  OnQueueError,
  OnQueueFailed,
  OnQueuePaused,
  OnQueueProgress,
  OnQueueRemoved,
  OnQueueResumed,
  OnQueueStalled,
  OnQueueWaiting,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job, Queue } from 'bull';

@Processor('task')
export class TaskProcessor {
  constructor(@InjectQueue('task') private readonly taskQueue: Queue) {}

  @Process('heavy')
  async processHeavyTask(job: Job<number>) {
    console.log('Processing', job.id, 'for', job.data, 'seconds');
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(undefined);
      }, job.data * 1000);
    });
    console.log('Processing done', job.id);
  }

  @OnQueueActive()
  onQueueActive(job: Job) {
    console.log('OnQueueActive', job.id);
  }

  @OnQueueError()
  onQueueError(error: Error) {
    console.log('OnQueueError', error);
  }

  @OnQueueWaiting()
  onQueueWaiting(jobId: number | string) {
    console.log('OnQueueWaiting', jobId);
  }

  @OnQueueStalled()
  onQueueStalled(job: Job) {
    console.log('OnQueueStalled', job.id);
  }

  @OnQueueProgress()
  onQueueProgress(job: Job, progress: number) {
    console.log('OnQueueProgress', job.id, progress);
  }

  @OnQueueCompleted()
  onQueueCompleted(job: Job, result: any) {
    console.log('OnQueueCompleted', job.id, result);
  }

  @OnQueueFailed()
  onQueueFailed(job: Job, err: Error) {
    console.log('onQueueFailed', job.id, err);
  }

  @OnQueuePaused()
  onQueuePaused() {
    console.log('OnQueuePaused');
  }

  @OnQueueResumed()
  onQueueResumed(job: Job) {
    console.log('OnQueueResumed', job.id);
  }

  @OnQueueCleaned()
  onQueueCleaned(jobs: Job[], type: string) {
    console.log('OnQueueCleaned', jobs, type);
  }

  @OnQueueDrained()
  onQueueDrained() {
    console.log('OnQueueDrained');
  }

  @OnQueueRemoved()
  onQueueRemoved(job: Job) {
    console.log('OnQueueRemoved', job.id);
  }
}
