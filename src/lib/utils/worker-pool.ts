type WorkerTask<T> = {
  id: string;
  data: any;
  resolve: (value: T) => void;
  reject: (error: any) => void;
  status: 'pending' | 'processing' | 'completed' | 'failed';
};

type WorkerWrapper = {
  worker: Worker;
  isRunning: boolean;
  index: number;
};

export class WebWorkerPool {
  private workerScript: ReturnType<typeof WebWorkerPool.createWorker>;
  private poolSize: number;
  private workers: WorkerWrapper[] = [];
  private taskQueue: WorkerTask<any>[] = [];
  private taskCounter = 0;
  private isTerminated = false;

  constructor(
    workerScript: ReturnType<typeof WebWorkerPool.createWorker>,
    poolSize: number
  ) {
    this.workerScript = workerScript;
    this.poolSize = poolSize;
    this.initializeWorkers();
  }

  static createWorker(scriptURL: string | URL, options?: WorkerOptions) {
    // console.log(scriptURL, 'scriptURL');
    return () => new Worker(scriptURL, options);
  }

  private initializeWorkers() {
    for (let i = 0; i < this.poolSize; i++) {
      const worker = this.workerScript();
      const wrapper: WorkerWrapper = {
        worker,
        isRunning: false,
        index: i
      };

      worker.onmessage = (event) => this.handleWorkerMessage(wrapper, event);
      worker.onerror = (error) => this.handleWorkerError(wrapper, error);
      worker.onmessageerror = (error) => this.handleWorkerMessageError(wrapper, error);

      this.workers.push(wrapper);
    }
  }

  exec<T = any>(data: any): Promise<T> {
    if (this.isTerminated) {
      throw new Error('Worker pool has been terminated');
    }

    return new Promise<T>((resolve, reject) => {
      const task: WorkerTask<T> = {
        id: this.uuid(),
        data,
        resolve,
        reject,
        status: 'pending'
      };

      this.taskQueue.push(task);
      this.processQueue();
    });
  }

  private processQueue() {
    if (this.taskQueue.length === 0) return;

    // 空闲worker
    const worker = this.workers.find((worker) => !worker.isRunning);
    if (!worker) return;

    const task = this.taskQueue.shift();
    if (!task) return;

    task.status = 'processing';
    worker.isRunning = true;

    try {
      worker.worker.postMessage({
        taskId: task.id,
        data: task.data
      });
    } catch (error) {
      task.status = 'failed';
      task.reject(error);
      worker.isRunning = false;
      this.processQueue();
    }
  }

  /**
   * 处理 Worker 返回的消息
   */
  private handleWorkerMessage(wrapper: WorkerWrapper, event: MessageEvent) {
    const { taskId, result, error } = event.data;

    // 查找对应的任务
    const taskIndex = this.taskQueue.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) {
      throw new Error(`Task ${taskId} not found in queue`);
    }

    const task = this.taskQueue[taskIndex];

    if (error) {
      task.status = 'failed';
      task.reject(error);
    } else {
      task.status = 'completed';
      task.resolve(result);
    }

    // 移除已完成的任务
    this.taskQueue.splice(taskIndex, 1);

    // 标记 Worker 为空闲并处理下一个任务
    wrapper.isRunning = false;
    this.processQueue();
  }

  /**
   * 处理 Worker 错误
   */
  private handleWorkerError(wrapper: WorkerWrapper, error: ErrorEvent) {
    // console.error(`Worker ${wrapper.id} error:`, error);
    // // 重新创建 Worker
    // this.replaceWorker(wrapper);
    // // 处理当前 Worker 的任务（如果有）
    // const currentTask = this.taskQueue.find((t) =>
    //   this.workers.some((w) => w.id === wrapper.id && w.isBusy)
    // );
    // if (currentTask) {
    //   currentTask.status = 'failed';
    //   currentTask.reject(new Error(`Worker ${wrapper.id} crashed`));
    // }
    // wrapper.isBusy = false;
    // this.processQueue();
  }

  /**
   * 处理消息错误
   */
  private handleWorkerMessageError(wrapper: WorkerWrapper, error: MessageEvent) {
    // console.error(`Worker ${wrapper.id} message error:`, error);
    // this.replaceWorker(wrapper);
  }

  /**
   * 替换损坏的 Worker
   */
  // private replaceWorker(oldWrapper: WorkerWrapper) {
  //   oldWrapper.worker.terminate();

  //   const newWorker = this.workerScript();
  //   const newWrapper: WorkerWrapper = {
  //     worker: newWorker,
  //     isRunning: false,
  //     index: oldWrapper.index
  //   };

  //   newWorker.onmessage = (event) => this.handleWorkerMessage(newWrapper, event);
  //   newWorker.onerror = (error) => this.handleWorkerError(newWrapper, error);
  //   newWorker.onmessageerror = (error) =>
  //     this.handleWorkerMessageError(newWrapper, error);

  //   // 替换 Worker
  //   this.workers[oldWrapper.index] = newWrapper;
  // }

  private uuid(): string {
    return `${Date.now()}_${Math.random().toString(36).slice(2)}`;
  }

  /**
   * 移除任务
   */
  // private removeTask(taskId: string) {
  //   const index = this.taskQueue.findIndex((t) => t.id === taskId);
  //   if (index !== -1) {
  //     this.taskQueue.splice(index, 1);
  //   }
  // }

  /**
   * 获取池状态
   */
  getStatus() {
    return {
      totalWorkers: this.workers.length,
      busyWorkers: this.workers.filter((w) => w.isRunning).length,
      idleWorkers: this.workers.filter((w) => !w.isRunning).length,
      queuedTasks: this.taskQueue.length,
      isTerminated: this.isTerminated
    };
  }

  /**
   * 终止所有 Worker
   */
  terminate() {
    this.isTerminated = true;
    this.workers.forEach((wrapper) => {
      wrapper.worker.terminate();
    });
    this.workers = [];
    this.taskQueue = [];
  }

  /**
   * 清空任务队列
   */
  clearQueue() {
    this.taskQueue.forEach((task) => {
      if (task.status === 'pending') {
        task.reject(new Error('Task queue cleared'));
      }
    });
    this.taskQueue = [];
  }
}

// 示例 Worker 脚本模板
// export const createWorkerScript = (handler: (data: any) => any): string => `
//   self.onmessage = function(event) {
//     const { taskId, data } = event.data;

//     try {
//       const result = (${handler.toString()})(data);

//       if (result instanceof Promise) {
//         result
//           .then(res => self.postMessage({ taskId, result: res }))
//           .catch(error => self.postMessage({ taskId, error: error.message }));
//       } else {
//         self.postMessage({ taskId, result });
//       }
//     } catch (error) {
//       self.postMessage({ taskId, error: error.message });
//     }
//   };
// `;

// `
//   self.onmessage = function(event) {
//     self.postMessage({ data:event.data,age:111  });
//   };
// `;
