import { For } from "solid-js";
import { A, RouteDataArgs, useParams, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { AdminOnly } from "~/components/admin-only";
import { TeamPreview } from "~/components/teams";
import { getTeamsForPlayer } from "~/server/teams";

export const routeData = ({ params }: RouteDataArgs) => {
  const teams = createServerData$(([, id]) => getTeamsForPlayer(id), {
    key: () => ["teams-for-player-in-seasson", params.id],
    initialValue: [],
  });

  return teams;
};

export default () => {
  const teams = useRouteData<typeof routeData>();
  const playerId = useParams().id;

  return (
    <div class="flex flex-col justify-center space-y-4">
      <AdminOnly>
        <div class="flex grow justify-end">
          <A
            href={`/admin/player-season/${playerId}`}
            class="btn-outline btn-circle btn justify-self-end"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-4 w-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </A>
        </div>
      </AdminOnly>

      <For each={teams()}>
        {(team) => (
          <TeamPreview
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
