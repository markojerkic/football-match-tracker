import { For } from "solid-js";
import { A, RouteDataArgs, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { getTeamsForPlayer } from "~/server/teams";

export const routeData = ({ params }: RouteDataArgs) => {
  const teams = createServerData$(([, id]) => getTeamsForPlayer(id), {
    key: () => ["teams-for-player-in-seasson", params.id],
    initialValue: [],
  });

  return teams;
};

const Team = (team: {
  name: string;
  id: string;
  imageSlug: string | null;
  seasonName: string;
  seasonId: string;
}) => {
  return (
    <div class="flex w-full flex-col space-y-4">
      <span class="flex items-center space-x-4">
        <A href={`/team/${team.id}`}>
          <img
            src={team.imageSlug ?? "/shield.svg"}
            class="avatar h-12 object-cover"
          />
        </A>
        <span class="flex flex-col justify-around">
          <A class="font-semibold" href={`/team/${team.id}`}>
            {team.name}
          </A>

          {/* TODO: go to games  */}
          <A class="font-thin hover:link" href={`/season/${team.seasonId}`}>
            {team.seasonName}
          </A>
        </span>
      </span>

      <span class="divider" />
    </div>
  );
};

export default () => {
  const teams = useRouteData<typeof routeData>();

  return (
    <div class="flex flex-col justify-center space-y-4">
      <For each={teams()}>
        {(team) => (
          <Team
            name={team.teamName}
            id={team.teamId}
            imageSlug={team.teamImageSlug}
            seasonName={team.seasonName}
            seasonId={team.seasonId}
          />
        )}
      </For>
    </div>
  );
};
