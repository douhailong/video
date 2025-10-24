type Status = 'waiting' | 'successful' | 'failed';
type AsyncFunction<T> = () => Promise<T>;
type Result<T> = { data: T | typeof Error; status: Status; index: number };
type Queue<T> = {
  fn: AsyncFunction<T>;
  index: number;
  status: Status;
};

export class PromisePool<T> {
  private maxCount: number;
  private queue: Queue<T>[] = [];
  private results: Result<T>[] = [];
  private runningCount = 0;
  private isRunning = false;

  constructor(fns: AsyncFunction<T>[], maxCount: number = 6) {
    this.queue = fns.map((fn, index) => ({ fn, index, status: 'waiting' }));
    this.maxCount = maxCount;
    this.results = Array.from({ length: fns.length });
  }

  add(fn: AsyncFunction<T>) {
    const index = this.results.length;
    this.queue.push({ fn, index, status: 'waiting' });
    this.results.push(undefined as any);
  }

  exec(callback?: (result: Result<T>) => void): Promise<Result<T>[]> {
    if (this.isRunning) {
      throw new Error('Pool is already running');
    }

    this.isRunning = true;

    return new Promise((resolve) => {
      const checkCompletion = () => {
        if (this.runningCount === 0 && this.queue.length === 0) {
          this.isRunning = false;
          return resolve(this.results);
        }

        while (this.runningCount < this.maxCount && this.queue.length > 0) {
          const task = this.queue.shift()!;
          const { fn, index } = task;

          this.runningCount++;

          fn()
            .then((data) => {
              const result: Result<T> = { data, status: 'successful', index };
              this.results[index] = result;
              callback && callback(result);
            })
            .catch((error) => {
              const result: Result<T> = { data: error, status: 'failed', index };
              this.results[index] = result;
              callback && callback(result);
            })
            .finally(() => {
              this.runningCount--;
              checkCompletion();
            });
        }
      };

      checkCompletion();
    });
  }
}
