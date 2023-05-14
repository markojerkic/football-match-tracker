import { For } from "solid-js";
import {
  RouteDataArgs,
  useNavigate,
  useParams,
  useRouteData,
} from "solid-start";
import { createServerData$ } from "solid-start/server";
import { Select } from "~/components/form-helpers";
import { PlayerPreview } from "~/components/player";
import { getPlayersForTeamInSeason } from "~/server/players";
import { getAllSeasons } from "~/server/seasons";

export const routeData = ({ params }: RouteDataArgs) => {
  const players = createServerData$(
    ([, id, seasonId]) => getPlayersForTeamInSeason(id, seasonId),
    {
      key: () => ["players-team-season", params.id, params.seasonId],
    }
  );

  const seasons = createServerData$(() => getAllSeasons(), {
    key: ["seasons"],
  });
  return { players, seasons };
};

export default () => {
  const { players, seasons } = useRouteData<typeof routeData>();
  const params = useParams();
  const navigate = useNavigate();

  return (
    <div class="mt-4 flex flex-col space-y-4">
      <Select
        name="season"
        label="Season"
        id="season"
        options={seasons() ?? []}
        required
        control={{
          value: params.seasonId,
          setValue: (val) => navigate(`/team/${params.id}/players/${val}`),
        }}
      />

      <For each={players()}>
        {(player) => (
          <PlayerPreview
            firstName={player.player.firstName}
            lastName={player.player.lastName}
            id={player.player.id}
            imageSlug={player.player.imageSlug}
          />
        )}
      </For>
    </div>
  );
};
