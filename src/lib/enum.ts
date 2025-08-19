export const VideoStatus = {
  waiting: '等待中',
  uploading: '上传中',
  preparing: '处理中',
  ready: '处理完成',
  errored: '处理失败'
} as const;

export const VideoVisibility = {
  public: '公开',
  private: '私密'
} as const;
