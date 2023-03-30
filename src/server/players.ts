import { prisma } from "~/util/prisma";

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
