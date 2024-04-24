import type { ChannelVideoCardVariant } from "./types";
import type { VideoWithUser } from "@/utils/types";

import Image from "next/image";
import Link from "next/link";

interface ChannelVideoThumbProps {
  readonly video: VideoWithUser;
  readonly variant?: ChannelVideoCardVariant;
}

export function ChannelVideoThumb({
  video,
  variant = "main",
}: ChannelVideoThumbProps) {
  return (
    <Link
      href={`/watch?v=${video.id}`}
      className={`relative z-10 w-full ${
        variant === "large"
          ? "xs:rounded-xl"
          : variant === "small"
            ? "xs:h-[118px] xs:w-[220px] h-[90px] w-40"
            : "h-[138px] w-[246px]"
      } outline-none ring-purple-400 duration-200 hover:opacity-90 focus:ring-2`}
    >
      {variant === "large" ? (
        <Image
          src={video.thumb}
          alt={video.title}
          width={360}
          height={200}
          className="xs:rounded-xl aspect-video w-full object-cover"
        />
      ) : variant === "small" ? (
        <Image
          src={video.thumb}
          alt={video.title}
          width={220}
          height={118}
          className="xs:h-[118px] xs:w-[220px] aspect-video h-[90px] w-40 rounded-md object-cover"
        />
      ) : (
        <Image
          src={video.thumb}
          alt={video.title}
          className="mr-0 aspect-video h-[138px] w-[246px] rounded-md object-cover"
          width={246}
          height={138}
        />
      )}
    </Link>
  );
}
