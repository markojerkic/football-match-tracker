import { SubstitutionEvent } from "~/components/events";
import { prisma } from "~/util/prisma";

export const getSubsFromGame = async (
  gameId: string
): Promise<SubstitutionEvent[]> => {
  const subs = await prisma.substitution.findMany({
    where: {
      gameId,
    },
    select: {
      minute: true,
      extraTimeMinute: true,
      isHomeTeam: true,
      playerIn: {
        select: {
          id: true,
          lastName: true,
        },
      },
      playerOut: {
        select: {
          id: true,
          lastName: true,
        },
      },
    },
  });

  return subs.map((sub) => ({
    minute: sub.minute,
    extraTimeMinute: sub.extraTimeMinute ?? undefined,
    isHomeTeam: sub.isHomeTeam,
    playerInId: sub.playerIn?.id ?? "",
    playerInName: sub.playerIn?.lastName ?? "",
    playerOutId: sub.playerOut?.id ?? "",
    playerOutName: sub.playerOut?.lastName ?? "",
  }));
};
