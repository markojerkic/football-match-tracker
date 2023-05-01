import { prisma } from "~/util/prisma";

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
