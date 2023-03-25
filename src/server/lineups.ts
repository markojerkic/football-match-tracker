import { z } from "zod";
import { prisma } from "~/util/prisma";

type TPlayerInGameLineup = {
  playerId: string;
  lineupRow: number;
  lineupColumn: number;
  shirtNumber: number;
};

export type PlayerInLineup = TPlayerInGameLineup & { lastName: string };

const lineupValidator = z
  .object({
    playerId: z.string(),
    lineupRow: z.number(),
    lineupColumn: z.number(),
    shirtNumber: z.number(),
  })
  .array();

const mapLineup = ({
  playersRaw,
  lastNames,
}: {
  playersRaw: TPlayerInGameLineup[];
  lastNames: Map<string, string>;
}) => {
  const lineup: PlayerInLineup[][] = [];

  for (let player of playersRaw) {
    const playerLastName = lastNames.get(player.playerId);
    if (!playerLastName) {
      throw Error(`Player with id ${player} could not be found`);
    }
    const playerInLineup = {
      ...player,
      lastName: playerLastName,
    };

    const row = lineup[player.lineupRow];
    if (!row) {
      lineup[player.lineupRow] = [];
    }
    lineup[player.lineupRow][player.lineupColumn] = playerInLineup;
  }

  return lineup;
};

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

  return {
    homeTeamShirtColor: lineup.homeTeamShirtColor,
    homeTeamGoalkeeperShirtColor: lineup.homeTeamGoalkeeperShirtColor,
    awayTeamShirtColor: lineup.awayTeamShirtColor,
    awayTeamGoalkeeperShirtColor: lineup.awayTeamGoalkeeperShirtColor,
    homeTeamLineup,
    awayTeamLineup,
  };
};

export type Lineups = Awaited<ReturnType<typeof getLineups>>;
