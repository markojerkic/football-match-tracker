import { prisma } from "~/util/prisma";
import { type Option } from "~/components/form-helpers";

export const getCompetitionSeasonsIds = async (
  teamId: string
): Promise<Option[]> => {
  return prisma.teamInCompetition
    .findMany({
      where: {
        teamId,
      },

      orderBy: {
        competitionInSeason: {
          season: {
            title: "desc",
          },
        },
      },

      select: {
        id: true,

        competitionInSeason: {
          select: {
            id: true,
            season: {
              select: {
                title: true,
              },
            },

            competition: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })
    .then((competitionSeasons) =>
      competitionSeasons.map(
        (cs) =>
          ({
            label: `${cs.competitionInSeason.competition.name} - ${cs.competitionInSeason.season.title}`,
            value: cs.competitionInSeason.id,
          } satisfies Option)
      )
    );
};

export const getCompetitionSeasons = async (
  teamId: string
): Promise<Option[]> => {
  return prisma.teamInCompetition
    .findMany({
      where: {
        teamId,
      },

      orderBy: {
        competitionInSeason: {
          season: {
            title: "desc",
          },
        },
      },

      select: {
        id: true,

        competitionInSeason: {
          select: {
            season: {
              select: {
                title: true,
              },
            },

            competition: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })
    .then((competitionSeasons) =>
      competitionSeasons.map(
        (cs) =>
          ({
            label: `${cs.competitionInSeason.competition.name} - ${cs.competitionInSeason.season.title}`,
            value: cs.id,
          } satisfies Option)
      )
    );
};

export const getAllSeasons = async (): Promise<Option[]> => {
  return prisma.season
    .findMany({
      select: {
        id: true,
        title: true,
      },
    })
    .then((seasons) =>
      seasons.map(
        (s) =>
          ({
            label: s.title,
            value: s.id,
          } satisfies Option)
      )
    );
};

export const getSeasonsFromCompetition = async (competition: string) => {
  if (!competition) {
    return [];
  }

  return prisma.competitionInSeason
    .findMany({
      where: {
        competitionId: competition,
      },
      select: {
        season: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })
    .then((seasons) =>
      seasons.map((s) => ({ label: s.season.title, value: s.season.id }))
    );
};
