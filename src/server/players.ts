import { ServerError } from "solid-start";
import { prisma } from "~/util/prisma";

export const getPlayerById = async (id: string) => {
  return prisma.player
    .findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        imageSlug: true,

        currentTeam: {
          select: {
            id: true,
            name: true,
            imageSlug: true,
          },
        },
      },
    })
    .then((player) => {
      if (!player) {
        throw new ServerError("Player not found");
      }
      return player;
    });
};

export const getPlayersInTeamAndSeason = async (
  teamId: string | undefined,
  seasonId: string | undefined
) => {
  if (!teamId || !seasonId) {
    return [];
  }

  return prisma.playersTeamInSeason
    .findMany({
      where: {
        seasonId,
        teamId,
      },
      select: {
        player: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })
    .then((players) =>
      players.map((p) => ({
        label: `${p.player.firstName} ${p.player.lastName}`,
        value: p.player.id,
      }))
    );
};
