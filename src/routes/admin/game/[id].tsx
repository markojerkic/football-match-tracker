// @refresh reload
import { ErrorBoundary, Resource, Show } from "solid-js";
import { ErrorMessage, RouteDataArgs, useRouteData } from "solid-start";
import {
  HttpStatusCode,
  ServerError,
  createServerData$,
} from "solid-start/server";
import GameEdit, { GameForm } from "~/components/game-edit";
import { StatisticsForm } from "~/components/statistic";
import { getCompetitionOptions } from "~/server/competitions";
import { getGameFormData } from "~/server/games";
import { getStatisticsFromGame } from "~/server/statistics";

export const routeData = ({ params }: RouteDataArgs<{ id: string }>) => {
  const competitions = createServerData$(async () => getCompetitionOptions(), {
    key: () => ["admin-edit-game"],
    initialValue: [],
  });

  const gameData: Resource<GameForm | undefined> = createServerData$(
    async ([, gameId]) => {
      const game = await getGameFormData(gameId);
      if (game === null) {
        throw new ServerError("Game not found");
      }
      console.log("gd", game);
      return game;
    },
    { key: () => ["admin-game", params.id], deferStream: true }
  );

  const statistics: Resource<StatisticsForm | undefined> = createServerData$(
    async ([, gameId]) => {
      const stats = await getStatisticsFromGame(gameId);
      return stats ?? undefined;
    },
    { key: () => ["admin-game-statistics", params.id], deferStream: true }
  );

  return {
    competitions,
    gameData,
    statistics,
  };
};

export default () => {
  const data = useRouteData<typeof routeData>();
  const nonEmptyCompetitions = () => data.competitions() ?? [];

  return (
    <ErrorBoundary
      fallback={(e) => (
        <Show when={e.message === "Game not found"}>
          <HttpStatusCode code={404} />
          <ErrorMessage error={e} />
        </Show>
      )}
    >
      <GameEdit
        competitions={nonEmptyCompetitions()}
        gameData={data.gameData()}
        statisticsData={data.statistics()}
      />
    </ErrorBoundary>
  );
};
