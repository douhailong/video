type PlayerProps = {};

const Player = ({}: PlayerProps) => {
  return <div>Player</div>;
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
