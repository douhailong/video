'use client';

import '@videojs/react/video/skin.css';
import { cn } from '@/lib/utils';
import { createPlayer, videoFeatures } from '@videojs/react';
import { VideoSkin, Video } from '@videojs/react/video';

const PlayerCore = createPlayer({ features: videoFeatures });

interface PlayerProps {
  // src: string;
}

const InternalPlayer = (props: PlayerProps) => {
  return (
    <PlayerCore.Provider>
      <VideoSkin>
        <Video src={props.src} playsInline autoPlay />
      </VideoSkin>
    </PlayerCore.Provider>
  );
};

const FitPlayer = (props: PlayerProps) => {
  return (
    <div className='aspect-video bg-purple-100'>
      {/* <InternalPlayer src='https://stream.mux.com/uqk9VgJzJn009eT01UPDCUXmWK3H1Ar5f29021NGhkFlPM.m3u8' /> */}
    </div>
  );
};

const FullPlayer = (props: PlayerProps) => {
  return (
    <div className='aspect-video bg-gray-300'>
      {/* <InternalPlayer src='https://stream.mux.com/uqk9VgJzJn009eT01UPDCUXmWK3H1Ar5f29021NGhkFlPM.m3u8' /> */}
    </div>
  );
};

export { FitPlayer, FullPlayer };
