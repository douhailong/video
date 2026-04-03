import Image from 'next/image';

import { cn } from '@/lib/utils';

type PlayerProps = {
  className?: string;
};

const Player = ({ className }: PlayerProps) => {
  return (
    <div className={cn('aspect-video', className)}>
      <Image
        fill
        className='object-cover'
        alt='player'
        src='http://localhost:9001/api/v1/download-shared-object/aHR0cDovLzEyNy4wLjAuMTo5MDAwL3lvdXR1YmUtY2xvbmUvdmlkZW8vU25pcGFzdGVfMjAyNi0wMi0yOF8xNS01OS0yNy5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1aNFk4Q0ZZRDJZVUJSUEFIQjFTMiUyRjIwMjYwMzIzJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDMyM1QwMTQ5MjZaJlgtQW16LUV4cGlyZXM9NDMxOTkmWC1BbXotU2VjdXJpdHktVG9rZW49ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmhZMk5sYzNOTFpYa2lPaUphTkZrNFEwWlpSREpaVlVKU1VFRklRakZUTWlJc0ltVjRjQ0k2TVRjM05ESTNNemMxTml3aWNHRnlaVzUwSWpvaVlXUnRhVzRpZlEuWkFoYlRnWXZNLXBvMjdvV1VVWmdKa3hrcVpRbTRieV9Tcm9oMDc5TzVZTXhvbVZSTFlkeHhuYXRQV2N4X3BZR2lqOFEtbDhjd29oRUotaWk5bEwzRUEmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JnZlcnNpb25JZD1udWxsJlgtQW16LVNpZ25hdHVyZT00M2JkNGY1MDZjMTAxOWViMjA2NjVhMmVhYzljNDQ4NzA2YmU3ZDJhMzJlYzgyYzM3YjNhYzU3YzE2NjZmMzk2'
      />
    </div>
  );
};

const FullPlayer = () => (
  <div className='block h-[56vw] max-h-[calc(100vh-169px)] min-h-60 bg-black lg:hidden'>
    full player
  </div>
);

const MiniPlayer = () => (
  <div className='hidden aspect-video rounded-lg bg-black lg:block'>mini player</div>
);

export { MiniPlayer, FullPlayer, Player };
