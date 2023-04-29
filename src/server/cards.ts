import { prisma } from "~/util/prisma";

export const getCardsFromGame = async (gameId: string) => {
  const cards = await prisma.cardAwarded.findMany({
    where: {
      gameId: gameId,
    },
    orderBy: {
      minute: "asc",
    },
    select: {
      minute: true,
      extraTimeMinute: true,
      cardType: true,
      player: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  return cards;
};
