import { getUserId, logout } from "./auth";
import { prisma } from "~/util/prisma";

export const isPlayerFavourite = async (
  id: string,
  request: Request
): Promise<boolean> => {
  const userId = await getUserId(request);
  if (!userId) {
    return false;
  }

  const favourite = await prisma.favouritePlayer.findUnique({
    where: {
      userId_playerId: {
        userId,
        playerId: id,
      },
    },
  });

  return favourite !== null;
};

export const toggleFavouritePlayer = async (
  playerId: string,
  request: Request
) => {
  const userId = await getUserId(request);
  if (!userId) {
    return logout(request);
  }

  const favourite = await prisma.favouritePlayer.findUnique({
    where: {
      userId_playerId: {
        userId,
        playerId,
      },
    },
  });

  if (favourite) {
    await prisma.favouritePlayer.delete({
      where: {
        id: favourite.id,
      },
    });
  } else {
    await prisma.favouritePlayer.create({
      data: {
        userId,
        playerId,
      },
    });
  }
};

export const isTeamFavourite = async (
  id: string,
  request: Request
): Promise<boolean> => {
  const userId = await getUserId(request);
  if (!userId) {
    return false;
  }

  const favourite = await prisma.favouriteTeam.findUnique({
    where: {
      userId_teamId: {
        userId,
        teamId: id,
      },
    },
  });

  return favourite !== null;
};

export const toggleFavouriteTeam = async (teamId: string, request: Request) => {
  const userId = await getUserId(request);
  if (!userId) {
    return logout(request);
  }

  const favourite = await prisma.favouriteTeam.findUnique({
    where: {
      userId_teamId: {
        userId,
        teamId,
      },
    },
  });

  if (favourite) {
    await prisma.favouriteTeam.delete({
      where: {
        id: favourite.id,
      },
    });
  } else {
    await prisma.favouriteTeam.create({
      data: {
        userId,
        teamId,
      },
    });
  }
};
