type EmptyProps = { text?: string };

const Empty = ({ text }: EmptyProps) => {
  return <div className='text-muted-foreground py-6'>{text ?? '没有可显示的内容'}</div>;
};

export default Empty;
