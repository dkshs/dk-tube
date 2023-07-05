import { useCallback, useEffect, useRef, useState } from "react";

import { motion } from "framer-motion";
import ReactPlayer from "react-player/youtube";

export type VideoProps = {
  videoId: string;
};

export function Video({ videoId }: VideoProps) {
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);

  const videoRef = useRef<ReactPlayer>(null);
  const ambilightVideoRef = useRef<ReactPlayer>(null);

  const optimizeAmbilight = useCallback((player?: Record<string, any>) => {
    if (!player || !player.getAvailableQualityLevels) return;
    const qualityLevels: string[] = [...player.getAvailableQualityLevels()];
    if (qualityLevels && qualityLevels.length && qualityLevels.length > 0) {
      qualityLevels.reverse();
      const lowestLevel =
        qualityLevels[qualityLevels.findIndex((q) => q !== "auto")];
      player.setPlaybackQuality(lowestLevel);
    }
  }, []);

  useEffect(() => {
    if (ambilightVideoRef.current) {
      ambilightVideoRef.current.seekTo(videoCurrentTime, "seconds");
      optimizeAmbilight(ambilightVideoRef.current.getInternalPlayer());
    }
  }, [optimizeAmbilight, videoCurrentTime]);

  return (
    <div className="relative flex h-full w-full justify-center">
      <div id="video" className="z-[999] aspect-video h-full w-full rounded-lg">
        <ReactPlayer
          ref={videoRef}
          url={`https://www.youtube.com/watch?v=${videoId}`}
          width="100%"
          height="100%"
          onPlay={() => {
            setVideoPlaying(true);
            setVideoCurrentTime(videoRef.current?.getCurrentTime() || 0);
          }}
          onPause={() => {
            setVideoPlaying(false);
            setVideoCurrentTime(videoRef.current?.getCurrentTime() || 0);
          }}
          controls
        />
      </div>
      <motion.div
        id="ambilight-video"
        className="pointer-events-none absolute left-0 top-0 -z-[1] h-full w-full shadow-[0_0_120px_rgba(0,0,0,0)] blur-[80px] saturate-[300%]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.5, scale: 1.25 }}
        transition={{ duration: 0.3, delay: 1 }}
      >
        <ReactPlayer
          url={`https://www.youtube.com/watch?v=${videoId}`}
          muted
          ref={ambilightVideoRef}
          width="100%"
          height="100%"
          playing={videoPlaying}
          onReady={(player) => optimizeAmbilight(player.getInternalPlayer())}
          controls={false}
        />
      </motion.div>
    </div>
  );
}
