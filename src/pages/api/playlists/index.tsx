import type { NextApiRequest, NextApiResponse } from "next";

import { createRouter } from "next-connect";
import { queryParser } from "@/utils/parser";
import { prisma } from "@/lib/prisma";
import { playlistFormatter } from "@/utils/formatters";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(async (req, res) => {
  try {
    const { limit, filter, orderBy } = queryParser(req);
    const orderColumn = orderBy?.column || "createdAt";
    const filterColumn = filter?.column || "name";

    const playlists = await prisma.playlist.findMany({
      orderBy: { [orderColumn]: orderBy?.value || "asc" },
      include: { user: true, videos: { include: { user: true } } },
      where: {
        [filterColumn]: {
          contains: filter?.value,
          mode: "insensitive",
        },
      },
      take: limit,
    });

    res.status(200).json(playlists.map((p) => playlistFormatter(p)));
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
      fullError: error,
      status: 500,
    });
  }
});

router.all((req, res) => {
  res.status(405).json({ error: "Method not allowed", status: 405 });
});

export default router.handler({
  onError(err, req, res) {
    res.status(400).json({
      error: (err as Error).message,
      status: 400,
    });
  },
});
