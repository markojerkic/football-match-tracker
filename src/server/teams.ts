import { prisma } from "~/util/prisma";
import { type Option } from "~/components/form-helpers";

export const getAllTeams = async (): Promise<Option[]> => {
  return prisma.team
    .findMany({
      select: {
        id: true,
        name: true,
      },
    })
    .then((teams) =>
      teams.map((t) => ({ value: t.id, label: t.name } satisfies Option))
    );
};

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
