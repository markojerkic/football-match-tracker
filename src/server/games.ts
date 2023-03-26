import { prisma } from "~/util/prisma";

export const getGames = async (selectedDate: string | undefined) => {
  const date = selectedDate !== undefined ? new Date(selectedDate) : undefined;
  const dayDate = date?.getDate();
  let gte = date? new Date(date.getTime()) : undefined;
  let lte = date? new Date(date.getTime()): undefined;
  if (dayDate && lte && gte) {
    gte.setDate(dayDate - 1);
    lte.setDate(dayDate + 1);
  }

  const games = await prisma.game
    .findMany({
      take: 20,
      orderBy: {
        kickoffTime: "desc",
      },
      where: {
        ...(
          lte !== undefined && gte !== undefined ?
            {
              kickoffTime: {
                gte,
                lte
              }
            } : {}
        )
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

  return games;
};

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
export type Game = ArrayElement<Awaited<ReturnType<typeof getGames>>>;

export const getLastId = (lastGamesPage: Game[]) => {
  let lastGameId = undefined;
  let kickoffTime = undefined;
  if (lastGamesPage?.length ?? 0 > 0) {
    lastGameId = lastGamesPage[lastGamesPage.length - 1].id;
    kickoffTime = lastGamesPage[lastGamesPage.length - 1].kickoffTime;
  }
  return lastGameId;
};

export const getGameDataById = async (id: string) => {
  return await prisma.game.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      kickoffTime: true,
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
      goals: {
        orderBy: {
          scoredInMinute: "asc",
        },
        select: {
          isHomeTeamGoal: true,
        },
      },
    },
  });
};

export type GameDataById = Awaited<ReturnType<typeof getGameDataById>>;

export const getGameGoalsById = async (gameId: string) => {
  return await prisma.goal.findMany({
    where: {
      gameId,
    },
    orderBy: {
      scoredInMinute: "asc",
    },
    select: {
      scoredInMinute: true,
      scoredInExtraMinute: true,
      isHomeTeamGoal: true,
      isOwnGoal: true,
      isPenalty: true,
      scoredBy: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      assistedBy: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });
};

export type GoalsInGame = Awaited<ReturnType<typeof getGameGoalsById>>;
