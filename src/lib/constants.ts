export const DEFAULT_LIMIT = 10;
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL!;

export const VideoStatus = {
  waiting: '正在等待中',
  preparing: '正在处理中',
  ready: '已完成',
  errored: '处理失败'
} as const;

export const WorkVisible = {
  template: '模板',
  public: '公开',
  private: '私密'
} as const;
