type WatchViewProps = {
  watchId: string;
  watchTime?: string;
};

const WatchView = ({ watchId, watchTime }: WatchViewProps) => {
  return (
    <div className='mx-auto flex max-w-[1700px] flex-col gap-6 p-6 lg:flex-row'>
      <div className='aspect-video flex-1 bg-red-200'>1</div>
      <div className='shrink-1 hidden bg-green-200 xl:block xl:w-[380px] 2xl:w-[460px]'>
        3
      </div>
    </div>
  );
};

export default WatchView;
