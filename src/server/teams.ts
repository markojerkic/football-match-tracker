import { prisma } from "~/util/prisma";
import { type Option } from "~/components/form-helpers";

export const getTeamsForPlayer = async (playerId: string) => {
  const teams = await prisma.playersTeamInSeason
    .findMany({
      where: {
        playerId,
      },

      orderBy: {
        season: {
          title: "asc",
        },
      },

      select: {
        id: true,
        team: {
          select: {
            id: true,
            name: true,
            imageSlug: true,
          },
        },

        season: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })
    .then((teams) =>
      teams.map((t) => ({
        teamId: t.team.id,
        teamName: t.team.name,
        teamImageSlug: t.team.imageSlug,
        seasonId: t.season.id,
        seasonName: t.season.title,
      }))
    );

  return teams;
};

export const getAllTeams = async (): Promise<Option[]> => {
  return prisma.team
    .findMany({
      orderBy: {
        name: "asc",
      },
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
