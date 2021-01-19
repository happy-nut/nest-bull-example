import { Test, TestingModule } from '@nestjs/testing';
import { TaskProcessor } from './task.processor';

describe('TaskProcessor', () => {
  let processor: TaskProcessor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskProcessor],
    }).compile();

    processor = module.get<TaskProcessor>(TaskProcessor);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });
});
