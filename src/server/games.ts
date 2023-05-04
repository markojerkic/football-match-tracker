import { GameForm } from "~/components/game-edit";
import { prisma } from "~/util/prisma";
import { PlayerInTeamLineup } from "./lineups";
import { CardEvent, Goal, SubstitutionEvent } from "~/components/events";
import { Formation } from "~/components/lineup";
import { StatisticsForm } from "~/components/statistic";
import { CardType, GameStatus } from "@prisma/client";
import { ServerError } from "solid-start";

export const getGamesForPlayer = async (playerId: string) => {
  const games = await prisma.game.findMany({
    where: {

      OR: [

        {
          homeTeamLineup: {
            // path: ["playerId"],
            array_contains: playerId,
          }
        },

        {
          awayTeamLineup: {
            // path: ["playerId"],
            array_contains: playerId,
          }
        }


      ]

    },

    select: {
      id: true,

      kickoffTime: true,

      homeTeam: {
        select: {
          id: true,
          name: true,
          imageSlug: true
        }
      },

      awayTeam: {
        select: {
          id: true,
          name: true,
          imageSlug: true
        }
      }

    }

  });

  console.log(games)

  return games;

}

export const getGames = async (selectedDate: string | undefined) => {
  const date = selectedDate !== undefined ? new Date(selectedDate) : undefined;
  const dayDate = date?.getDate();
  let gte = date ? new Date(date.getTime()) : undefined;
  let lte = date ? new Date(date.getTime()) : undefined;
  if (dayDate && lte && gte) {
    gte.setDate(dayDate);
    lte.setDate(dayDate + 1);
  }

  const games = await prisma.game
    .findMany({
      take: 20,
      orderBy: {
        kickoffTime: "desc",
      },
      where: {
        ...(lte !== undefined && gte !== undefined
          ? {
            kickoffTime: {
              gte,
              lte,
            },
          }
          : {}),
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

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
export type Game = ArrayElement<Awaited<ReturnType<typeof getGames>>>;

export const getLastId = (lastGamesPage: Game[]) => {
  let lastGameId = undefined;
  // let kickoffTime = undefined;
  if (lastGamesPage?.length ?? 0 > 0) {
    lastGameId = lastGamesPage[lastGamesPage.length - 1].id;
    // kickoffTime = lastGamesPage[lastGamesPage.length - 1].kickoffTime;
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

const getFormationFromDbObject = (
  formation: PlayerInTeamLineup[]
): Formation => {
  const maxPerRow = new Map<number, number>();
  for (let player of formation) {
    const currMax = maxPerRow.get(player.lineupRow);
    if (currMax === undefined || player.lineupColumn + 1 > currMax) {
      maxPerRow.set(player.lineupRow, player.lineupColumn + 1);
    }
  }

  const first = maxPerRow.get(1);
  const second = maxPerRow.get(2);
  const third = maxPerRow.get(3);
  const fourth = maxPerRow.get(4);

  const calculatedFormation = `${first}${second}${third}${fourth ?? ""}`;

  return calculatedFormation as Formation;
};

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

export const getGameFormData = async (
  gameId: string
): Promise<GameForm | null> => {
  const game: GameForm | null = await prisma.game
    .findUnique({
      where: {
        id: gameId,
      },
      include: {
        goals: {
          select: {
            id: true,
            scoredInMinute: true,
            scoredInExtraMinute: true,
            isOwnGoal: true,
            isHomeTeamGoal: true,
            isPenalty: true,
            scoredBy: {
              select: {
                id: true,
                lastName: true,
              },
            },
            assistedBy: {
              select: {
                id: true,
                lastName: true,
              },
            },
          },
        },

        substitutions: {
          include: {
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
        },

        cardsAwarded: {
          select: {
            id: true,
            cardType: true,
            isHomeTeam: true,
            player: {
              select: {
                id: true,
                lastName: true,
              },
            },
            minute: true,
            extraTimeMinute: true,
          },
        },
      },
    })
    .then((game) => {
      if (game === null) return null;

      if (!game.seasonId) return null;

      const goals: Goal[] = game.goals.map(
        (g) =>
        ({
          id: g.id,
          isHomeTeamGoal: g.isHomeTeamGoal,
          scorerId: g.scoredBy.id,
          isOwnGoal: g.isOwnGoal,
          isPenalty: g.isPenalty,
          scoredInMinute: g.scoredInMinute,
          scoredInExtraMinute: g.scoredInExtraMinute ?? undefined,
          assistentId: g.assistedBy?.id ?? undefined,
        } satisfies Goal)
      );

      const cards: CardEvent[] = game.cardsAwarded.map(
        (c) =>
        ({
          id: c.id,
          minute: c.minute,
          extraTimeMinute: c.extraTimeMinute ?? undefined,
          cardType: c.cardType,
          playerId: c.player.id,
          playerLastName: c.player.lastName,
          isHomeTeam: c.isHomeTeam,
        } satisfies CardEvent)
      );

      const substitutions: SubstitutionEvent[] = game.substitutions.map(
        (sub) =>
        ({
          id: sub.id,
          minute: sub.minute,
          extraTimeMinute: sub.extraTimeMinute ?? undefined,
          playerInId: sub.playerInId,
          playerInName: sub.playerIn?.lastName ?? "",
          playerOutId: sub.playerOutId,
          playerOutName: sub.playerOut?.lastName ?? "",
          isHomeTeam: sub.isHomeTeam,
        } satisfies SubstitutionEvent)
      );

      return {
        id: game.id,
        // FIXME: check if right formating
        kickoffTime: game.kickoffTime.toJSON(),
        competition: game.competitionId,
        season: game.seasonId,
        homeTeam: game.homeTeamId,
        awayTeam: game.awayTeamId,
        status: game.status,

        homeTeamManager: game.homeTeamManagerId,
        awayTeamManager: game.awayTeamManagerId,

        homeTeamShirtsColor: game.homeTeamShirtColor,
        awayTeamShirtsColor: game.awayTeamShirtColor,
        homeTeamGoalkeeperShirtsColor: game.homeTeamGoalkeeperShirtColor,
        awayTeamGoalkeeperShirtsColor: game.awayTeamGoalkeeperShirtColor,
        homeTeamLineup: game.homeTeamLineup as PlayerInTeamLineup[],
        awayTeamLineup: game.awayTeamLineup as PlayerInTeamLineup[],
        homeTeamFormation: getFormationFromDbObject(
          game.homeTeamLineup as PlayerInTeamLineup[]
        ),
        awayTeamFormation: getFormationFromDbObject(
          game.awayTeamLineup as PlayerInTeamLineup[]
        ),
        goals,
        cards,
        substitutions,
      } satisfies GameForm;
    });

  return game;
};

export const updateOrSaveGame = async (
  game: GameForm,
  statistics: StatisticsForm
) => {
  let gameId: string | undefined = game.id;

  const gameData = {
    competitionId: game.competition,
    homeTeamId: game.homeTeam,
    awayTeamId: game.awayTeam,
    kickoffTime: game.kickoffTime,

    homeTeamManagerId: game.homeTeamManager,
    awayTeamManagerId: game.awayTeamManager,

    firstHalfEndedAferAdditionalTime: 0,
    secondHalfEndedAferAdditionalTime: 0,
    status: game.status as GameStatus,

    seasonId: game.season,
    homeTeamShirtColor: game.homeTeamShirtsColor,
    homeTeamGoalkeeperShirtColor: game.homeTeamGoalkeeperShirtsColor,
    awayTeamShirtColor: game.awayTeamShirtsColor,
    awayTeamGoalkeeperShirtColor: game.awayTeamGoalkeeperShirtsColor,

    homeTeamLineup: game.homeTeamLineup,
    awayTeamLineup: game.awayTeamLineup,

    goals: {
      createMany: {
        data: game.goals,
      },
    },

    cardsAwarded: {
      createMany: {
        data: game.cards.map((card) => ({
          cardType: card.cardType as CardType,
          playerId: card.playerId,
          minute: card.minute,
          extraTimeMinute: card.extraTimeMinute,
          isHomeTeam: card.isHomeTeam,
        })),
      },
    },

    substitutions: {
      createMany: {
        data: game.substitutions.map((sub) => ({
          minute: sub.minute,
          extraTimeMinute: sub.extraTimeMinute,
          isHomeTeam: sub.isHomeTeam,
          playerInId: sub.playerInId,
          playerOutId: sub.playerOutId,
        })),
      },
    },
  };

  if (game.id) {
    const exists = await prisma.game
      .findUnique({ where: { id: gameId }, select: { id: true } })
      .then((g) => g !== null);

    if (!exists) {
      throw new ServerError("Game does not exists");
    }

    gameId = game.id;

    await Promise.all([
      prisma.goal.deleteMany({ where: { gameId } }),
      prisma.cardAwarded.deleteMany({ where: { gameId } }),
      prisma.substitution.deleteMany({ where: { gameId } }),
    ]);

    await prisma.game.update({
      where: {
        id: game.id,
      },

      data: gameData,
    });
  } else {
    gameId = await prisma.game
      .create({
        data: gameData,
      })
      .then((game) => game.id);
  }

  if (gameId === undefined) {
    throw new ServerError("Game does not exists");
  }

  const stats = {
    gameId,
    homeTeamBallPossession: statistics.homeTeamBallPossession,
    homeTeamTotalShots: statistics.homeTeamTotalShots,
    homeTeamShotsOnTarget: statistics.homeTeamShotsOnTarget,
    homeTeamCornerKicks: statistics.homeTeamCornerKicks,
    homeTeamOffsides: statistics.homeTeamOffsides,
    homeTeamFouls: statistics.homeTeamFouls,
    homeTeamBigChances: statistics.homeTeamBigChances,
    homeTeamPasses: statistics.homeTeamPasses,
    homeTeamCrosses: statistics.homeTeamCrosses,
    homeTeamTackles: statistics.homeTeamTackles,
    homeTeamDribles: statistics.homeTeamDribles,
    homeTeamDriblesSucessful: statistics.homeTeamDriblesSucessful,
    awayTeamBallPossession: statistics.awayTeamBallPossession,
    awayTeamTotalShots: statistics.awayTeamTotalShots,
    awayTeamShotsOnTarget: statistics.awayTeamShotsOnTarget,
    awayTeamCornerKicks: statistics.awayTeamCornerKicks,
    awayTeamOffsides: statistics.awayTeamOffsides,
    awayTeamFouls: statistics.awayTeamFouls,
    awayTeamBigChances: statistics.awayTeamBigChances,
    awayTeamPasses: statistics.awayTeamPasses,
    awayTeamCrosses: statistics.awayTeamCrosses,
    awayTeamTackles: statistics.awayTeamTackles,
    awayTeamDribles: statistics.awayTeamDribles,
    awayTeamDriblesSucessful: statistics.awayTeamDriblesSucessful,
  };

  if (statistics.id) {
    await prisma.gameStatistics.update({
      where: {
        id: statistics.id,
      },
      data: stats,
    });
  } else {
    await prisma.gameStatistics.create({
      data: stats,
    });
  }

  return gameId;
};
