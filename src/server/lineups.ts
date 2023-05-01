// @refresh reload
import { z } from "zod";
import { PlayerInLineup, mapLineup } from "~/util/lineups-mapper";
import { prisma } from "~/util/prisma";

export const lineupPlayerSchema = z.object({
  playerId: z.string(),
  lineupRow: z.number(),
  lineupColumn: z.number(),
  shirtNumber: z.number(),
});

const lineupValidator = lineupPlayerSchema.array();

export type PlayerInTeamLineup = z.infer<typeof lineupPlayerSchema>;

export const getLineups = async ({ gameId }: { gameId: string }) => {
  const lineup = await prisma.game.findUniqueOrThrow({
    where: {
      id: gameId,
    },
    select: {
      homeTeamLineup: true,
      awayTeamLineup: true,
      homeTeamShirtColor: true,
      homeTeamGoalkeeperShirtColor: true,
      awayTeamShirtColor: true,
      awayTeamGoalkeeperShirtColor: true,
    },
  });

  const [homeTeamLineupRaw, awayTeamLineupRaw] = await Promise.all([
    lineupValidator.parseAsync(lineup.homeTeamLineup),
    lineupValidator.parseAsync(lineup.awayTeamLineup),
  ]);

  const playerIds = [...homeTeamLineupRaw, ...awayTeamLineupRaw].map(
    (player) => player.playerId
  );

  const playerDetails = await prisma.player
    .findMany({
      where: {
        id: {
          in: playerIds,
        },
      },
      select: {
        lastName: true,
        id: true,
      },
    })
    .then(
      (players) =>
        new Map(players.map((player) => [player.id, player.lastName]))
    );

  if (playerDetails.size !== playerIds.length) {
    throw Error("Players with selected ids were not all found");
  }

  const homeTeamLineup: PlayerInLineup[][] = mapLineup({
    lastNames: playerDetails,
    playersRaw: homeTeamLineupRaw,
  });
  const awayTeamLineup: PlayerInLineup[][] = mapLineup({
    lastNames: playerDetails,
    playersRaw: awayTeamLineupRaw,
  });

  const result = {
    homeTeamShirtColor: lineup.homeTeamShirtColor,
    homeTeamGoalkeeperShirtColor: lineup.homeTeamGoalkeeperShirtColor,
    awayTeamShirtColor: lineup.awayTeamShirtColor,
    awayTeamGoalkeeperShirtColor: lineup.awayTeamGoalkeeperShirtColor,
    homeTeamLineup,
    awayTeamLineup,
  };
  return result;
};

export type Lineups = Awaited<ReturnType<typeof getLineups>>;
