import { RouteDataArgs, useRouteData } from "solid-start"
import { createServerData$ } from "solid-start/server"
import { getGamesForPlayer } from "~/server/games"

export const routeData = ({ params }: RouteDataArgs) => {

  const games = createServerData$(([, id]) => getGamesForPlayer(id), {
    key: () => ["games-for-player", params.id],
    initialValue: []
  });

  return games;
}

export default () => {
  const games = useRouteData<typeof routeData>();

  return (
    <div class="flex justify-between">
      <span>
        games
      </span>
      <span>
        games
      </span>

      <span>
      {JSON.stringify(games())}
      </span>
    </div>
  )
}
