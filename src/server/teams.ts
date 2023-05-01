import { prisma } from "~/util/prisma";

export const getTeamsInSeasonAndCompetition = async (
  seasonId: string,
  competitionId: string
) => {
  if (!competitionId || !seasonId) {
    return [];
  }

  return prisma.teamInCompetition
    .findMany({
      where: {
        seasonId,
        competitionId,
      },
      select: {
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
    .then((teams) =>
      teams.map((t) => ({ label: t.team.name, value: t.team.id }))
    );
};
