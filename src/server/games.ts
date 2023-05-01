import { Player } from "@prisma/client";
import { GameForm } from "~/components/game-edit";
import { prisma } from "~/util/prisma";
import { PlayerInTeamLineup } from "./lineups";
import { CardEvent, Goal, SubstitutionEvent } from "~/components/events";

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
        // FIXME: check if right formating
        kickoffTime: game.kickoffTime.toJSON(),
        competition: game.competitionId,
        season: game.seasonId,
        homeTeam: game.homeTeamId,
        awayTeam: game.awayTeamId,
        isGameOver: game.isOver,
        hasGameStarted: game.hasStarted,
        homeTeamShirtsColor: game.homeTeamShirtColor,
        awayTeamShirtsColor: game.awayTeamShirtColor,
        homeTeamGoalkeeperShirtsColor: game.homeTeamGoalkeeperShirtColor,
        awayTeamGoalkeeperShirtsColor: game.awayTeamGoalkeeperShirtColor,
        homeTeamLineup: game.homeTeamLineup as PlayerInTeamLineup[],
        awayTeamLineup: game.awayTeamLineup as PlayerInTeamLineup[],
        homeTeamFormation: "442",
        awayTeamFormation: "442",
        goals,
        cards,
        substitutions,
      } satisfies GameForm;
    });

  return game;
};
