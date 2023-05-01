import { prisma } from "~/util/prisma";

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
