import { prisma } from "~/util/prisma";


export const getGames = async (id?: string | undefined) => {
  console.log("request");
  const games = await prisma.game
    .findMany({
      take: 20,
      ...(id !== undefined && id !== null
        ? {
          cursor: {
            id
          },
        }
        : {}),
      orderBy: {
        // kickoffTime: "desc",
        id: "asc",
      },
      select: {
        id: true,
        homeTeam: {
          select: {
            name: true,
          },
        },
        awayTeam: {
          select: {
            name: true,
          },
        },
        kickoffTime: true,
        goals: {
          select: {
            isHomeTeamGoal: true,
          },
        },
      },
    })
    .then((games) => {
      return games.map((game) => {
        let homeTeamGoalCount = 0;
        let awayTeamGoalCount = 0;

        for (let goal of game.goals) {
          if (goal.isHomeTeamGoal) {
            homeTeamGoalCount++;
            continue;
          }
          awayTeamGoalCount++;
        }
        return { ...game, homeTeamGoalCount, awayTeamGoalCount };
      });
    });

  console.log("req gotov");

  return games;
};


type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
export type Game = ArrayElement<Awaited<ReturnType<typeof getGames>>>;

export const getLastId = (lastGamesPage: Game[]) => {
  console.log(lastGamesPage)
  let lastGameId = undefined;
  let kickoffTime = undefined;
  if (lastGamesPage?.length ?? 0 > 0) {
    lastGameId = lastGamesPage[lastGamesPage.length - 1].id;
    kickoffTime = lastGamesPage[lastGamesPage.length - 1].kickoffTime;
  }
  return lastGameId;
}

