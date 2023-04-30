import { CardEvent } from "~/components/events";
import { prisma } from "~/util/prisma";

export const getCardsFromGame = async (
  gameId: string
): Promise<CardEvent[]> => {
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
      isHomeTeam: true,
      player: {
        select: {
          id: true,
          lastName: true,
        },
      },
    },
  });

  return cards.map((card) => ({
    isHomeTeam: card.isHomeTeam,
    extraTimeMinute: card.extraTimeMinute ?? undefined,
    minute: card.minute,
    playerId: card.player?.id ?? "",
    playerLastName: card.player.lastName,
    cardType: card.cardType,
  }));
};
