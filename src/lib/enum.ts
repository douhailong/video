export const PostStatus = {
  waiting: '正在等待中',
  preparing: '正在处理中',
  ready: '已完成',
  errored: '处理失败'
} as const;

export const PostVisible = {
  public: '公开',
  private: '私密'
} as const;
