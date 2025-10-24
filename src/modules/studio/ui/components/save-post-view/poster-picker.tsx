import Image from 'next/image';

type PosterPickerProps = {};

const PosterPicker = ({}: PosterPickerProps) => {
  return (
    <div className='relative aspect-video h-24 overflow-hidden rounded-md bg-red-300'>
      <Image fill alt='poster' src='/placeholder.svg' />
      <div className='absolute bottom-0 left-0 right-0 flex h-7 items-center bg-black/50 text-white'>
        <button className='h-full flex-1 cursor-pointer text-xs'>跟换封面</button>|
        <button className='h-full flex-1 cursor-pointer text-xs'>封面模板</button>
      </div>
    </div>
  );
};

export default PosterPicker;
