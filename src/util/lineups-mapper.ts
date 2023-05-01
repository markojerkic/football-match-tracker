export type TPlayerInGameLineup = {
  playerId: string;
  lineupRow: number;
  lineupColumn: number;
  shirtNumber: number;
};

export type PlayerInLineup = TPlayerInGameLineup & { lastName: string };

export const mapLineup = ({
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
      throw Error(
        `Player with id ${JSON.stringify(player)} could not be found`
      );
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
