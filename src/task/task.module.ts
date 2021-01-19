import { Module, OnModuleInit } from '@nestjs/common';
import { TaskProcessor } from './task.processor';
import { BullModule, InjectQueue } from '@nestjs/bull';
import { Job, JobPromise, Queue } from 'bull';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'task',
    }),
  ],
  providers: [TaskProcessor],
})
export class TaskModule implements OnModuleInit {
  private jobIdPromiseMap: Record<number, JobPromise> = {};

  constructor(@InjectQueue('task') private readonly taskQueue: Queue) {}

  async onModuleInit(): Promise<void> {
    await this.cleanOldJobs();

    this.taskQueue.on('active', (activeJob, jobPromise) => {
      this.jobIdPromiseMap[activeJob.id] = jobPromise;
    });
    await this.showJobs();

    // 20초 동안 실행되는 job 추가.
    const job = await this.taskQueue.add('heavy', 20);
    await this.showJobs();

    // 목표 Process 에서 lock 이 걸려있는 job 을 종료시켜 보자.

    // 방법 1. Remove 호출.
    // this.methodOne(job);
    // 결과 1: 실패. Unhandled promise rejection 에러

    // 방법 2. JobPromise.cancel() 호출.
    // this.methodTwo(job);
    // 결과 2: 실패. this.jobIdPromiseMap[job.id] 가 undefined 라고 한다. 왜지?

    // 방법 3. moveToCompleted & remove 호출.
    this.methodThree(job);
    // 결과 3. onQueueRemoved 가 호출되긴 하는데, 원래 있던 job 다 끝나고 나서 Missing lock for job {job.id} failed 라는 에러
    //  그 이후에는 OnQueueDrained 가 호출됨.
    // 옵저버 패턴을 이용하면 process 까지 abort 시킬 수 있을 듯?
  }

  private methodThree(job: Job) {
    setTimeout(async () => {
      console.log('moveToCompleted & remove');
      await job.moveToCompleted();
      await job.remove();
      await this.showJobs();
    }, 2000);
  }

  private methodTwo(job: Job) {
    setTimeout(async () => {
      this.jobIdPromiseMap[job.id].cancel();
      await this.showJobs();

      await job.moveToCompleted();
      await this.showJobs();
    }, 5000);
  }

  private methodOne(job: Job) {
    setTimeout(async () => {
      await job.remove();
      await this.showJobs();
    }, 2000);
  }

  private async cleanOldJobs() {
    (await this.taskQueue.getJobs(['completed'])).map(
      async (job) => await job.remove(),
    );
    (await this.taskQueue.getJobs(['failed'])).map(
      async (job) => await job.remove(),
    );
  }

  private async showJobs() {
    console.log('----------------------------------------');
    console.log(
      'completedJobs',
      (await this.taskQueue.getJobs(['completed'])).map((job) => job.id),
    );
    console.log(
      'failedJobs',
      (await this.taskQueue.getJobs(['failed'])).map((job) => job.id),
    );
  }
}
