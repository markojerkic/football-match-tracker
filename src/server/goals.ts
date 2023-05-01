import { prisma } from "~/util/prisma";
import { type Goal } from "~/components/events";
import { ArrayElement, GoalsInGame } from "~/server/games";

export const getMappedGoals = async (fg: Goal[]) => {
  const formGoals = fg as Goal[];

  const playerIds = formGoals
    .map((g) => [g.scorerId, g.assistentId])
    .flat()
    .filter((id) => id !== undefined);
  console.log("playerIds", playerIds);
  const players = await prisma.player.findMany({
    where: {
      id: {
        in: playerIds as string[],
      },
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  });
  console.log("players", players);

  const mappedGoals: GoalsInGame = formGoals.map((g) => {
    const scorer = players.find((p) => p.id === g.scorerId);
    const assistent = players.find((p) => p.id === g.assistentId);

    const goal: ArrayElement<GoalsInGame> = {
      isOwnGoal: g.isOwnGoal,
      isPenalty: g.isPenalty,
      scoredInMinute: g.scoredInMinute,
      scoredInExtraMinute: g.scoredInExtraMinute ?? null,
      scoredBy: {
        firstName: scorer?.firstName ?? "",
        lastName: scorer?.lastName ?? "",
      },

      assistedBy: null,
      isHomeTeamGoal: g.isHomeTeamGoal,
    };
    if (assistent !== undefined) {
      goal.assistedBy = {
        firstName: assistent?.firstName ?? "",
        lastName: assistent?.lastName ?? "",
      };
    }
    return goal;
  });

  return mappedGoals;
}
