import { StatisticsForm } from "~/components/statistic";
import { prisma } from "~/util/prisma";

export const getStatisticsFromGame = async (
  gameId: string
): Promise<StatisticsForm | null> => {
  const stats: StatisticsForm | null = await prisma.gameStatistics.findUnique({
    where: {
      gameId,
    },
  });

  return stats;
};
