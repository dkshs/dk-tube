"use server";

import { revalidateTag } from "next/cache";
import { env } from "@/env";
import { prisma } from "@/lib/prisma";
import { authActionClient } from "@/lib/safe-action";
import { formatDuration, getMostQualityThumb } from "@/utils/youtube";
import {
  createVideoSchema,
  likeVideoSchema,
  removeVideoSchema,
} from "./schema";

export const createVideoAction = authActionClient
  .schema(createVideoSchema)
  .action(async ({ clientInput: { title, youtubeId }, ctx: { user } }) => {
    const thumb = await getMostQualityThumb(youtubeId);
    if (!thumb) {
      throw new Error("Houve um erro ao obter a thumbnail do vídeo!");
    }

    const details = await (
      await fetch(
        `https://www.googleapis.com/youtube/v3/videos?id=${youtubeId}&key=${env.GC_API_KEY}&part=contentDetails`,
      )
    ).json();

    const ytDuration = details.items[0].contentDetails.duration as string;
    const duration = formatDuration(ytDuration);

    try {
      await prisma.video.create({
        data: {
          title,
          youtubeId,
          thumb,
          duration,
          user: { connect: { externalId: user.id } },
        },
      });
    } catch {
      throw new Error("Houve um erro ao criar o vídeo!");
    }

    revalidateTag("videos");
  });

export const likeVideoAction = authActionClient
  .schema(likeVideoSchema)
  .action(async ({ clientInput: { videoId }, ctx: { user } }) => {
    const video = await prisma.video.findFirst({
      where: { id: videoId },
      select: { id: true, likedVideosUsers: { select: { externalId: true } } },
    });

    if (!video) {
      throw new Error("Vídeo não encontrado!");
    }

    const connected = video.likedVideosUsers.some(
      (v) => v.externalId === user.id,
    );
    try {
      await prisma.user.update({
        where: { externalId: user.id },
        data: {
          likedVideos: {
            [connected ? "disconnect" : "connect"]: {
              id: video.id,
            },
          },
        },
      });
    } catch {
      throw new Error("Houve um erro ao curtir o vídeo!");
    }

    revalidateTag(`video:${videoId}`);
    revalidateTag(`isLiked:${user.id}:${videoId}`);
    revalidateTag(`feed:${user.id}`);
    revalidateTag(`likedVideos:${user.id}`);

    return { hasAdded: !connected };
  });

export const removeVideoAction = authActionClient
  .schema(removeVideoSchema)
  .action(async ({ clientInput: { videoId }, ctx: { user } }) => {
    const video = await prisma.video.findFirst({
      where: { id: videoId, user: { externalId: user.id } },
    });

    if (!video) {
      throw new Error("Vídeo não encontrado!");
    }

    try {
      await prisma.video.delete({
        where: { id: video.id },
      });
    } catch {
      throw new Error("Houve um erro ao remover o vídeo!");
    }

    revalidateTag("videos");
    revalidateTag(`video:${video.id}`);
    revalidateTag(`feed:${user.id}`);
  });
