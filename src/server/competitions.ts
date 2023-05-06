import { prisma } from "~/util/prisma";

export const getLatestSeasonForCompetition = (competitionId: string) => {
  return prisma.competitionInSeason.findFirstOrThrow({
    where: {
      competitionId,
    },
    orderBy: {
      seasonId: "desc",
    },
    select: {
      seasonId: true,
    },
  });
};

export const getCompetitionDetail = (id: string) => {
  return prisma.competition.findUniqueOrThrow({
    where: {
      id,
    },

    select: {
      name: true,
      country: {
        select: {
          name: true,
          imageSlug: true,
        },
      },
    },
  });
};

export const getCompetitionOptions = () => {
  return prisma.competition
    .findMany({
      select: {
        id: true,
        name: true,
        country: {
          select: {
            name: true,
          },
        },
      },
    })
    .then((competitions) =>
      competitions.map((c) => ({
        label: `${c.country.name} - ${c.name}`,
        value: c.id,
      }))
    );
};
