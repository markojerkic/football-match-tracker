import { prisma } from "~/util/prisma";
import { type Option } from "~/components/form-helpers";

export const getCompetitionSeasons = async (
  teamId: string
): Promise<Option[]> => {
  return prisma.teamInCompetition
    .findMany({
      where: {
        teamId,
      },

      orderBy: {
        season: {
          title: "desc",
        },
      },

      select: {
        id: true,

        season: {
          select: {
            title: true,
          },
        },

        compatition: {
          select: {
            name: true,
          },
        },
      },
    })
    .then((competitionSeasons) =>
      competitionSeasons.map(
        (cs) =>
          ({
            label: `${cs.compatition.name} - ${cs.season.title}`,
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
