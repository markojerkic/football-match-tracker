import { For, Show } from "solid-js";
import { A, useRouteData, useSearchParams } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { findManagers } from "~/server/managers";
import { findPlayers } from "~/server/players";
import { findTeams } from "~/server/teams";

export const routeData = () => {
  const [params] = useSearchParams<{ q: string }>();
  const q = () => params.q ?? "";

  const players = createServerData$(
    ([, query]) => {
      return findPlayers(query);
    },
    {
      key: () => ["search-players", q()],
      initialValue: [],
    }
  );

  const managers = createServerData$(
    ([, query]) => {
      return findManagers(query);
    },
    {
      key: () => ["search-managers", q()],
      initialValue: [],
    }
  );

  const teams = createServerData$(
    ([, query]) => {
      return findTeams(query);
    },
    {
      key: () => ["search-teams", q()],
      initialValue: [],
    }
  );

  return {
    players,
    teams,
    managers,
  };
};

export default () => {
  const { players, teams, managers } = useRouteData<typeof routeData>();

  return (
    <div class="border-1 mx-auto flex w-[90%] flex-col justify-around space-x-4 border border-black p-4 lg:w-[50%] lg:flex-row">
      <div class="flex flex-col">
        <span class="my-4 text-2xl font-bold">Players</span>
        <For each={players()}>
          {(player) => (
            <A href={`/player/${player.id}`} class="group relative block">
              <span class="absolute inset-0 border-2 border-dashed border-black"></span>

              <div class="relative h-full w-full transform border-2 border-black bg-white transition-transform group-hover:-translate-x-2 group-hover:-translate-y-2">
                <div class="flex p-4">
                  {/* Content */}
                  <span class="flex space-x-4 text-sm">
                    <Show when={player.imageSlug} keyed>
                      {(slug) => (
                        <img
                          alt={player.lastName}
                          class="avatar h-10 object-cover"
                          src={slug}
                        />
                      )}
                    </Show>
                  </span>
                  <span class="flex w-full flex-col space-y-1">
                    {player.firstName} {player.lastName}
                  </span>
                </div>
              </div>
            </A>
          )}
        </For>
      </div>

      <div class="flex flex-col">
        <span class="my-4 text-2xl font-bold">Managers</span>
        <For each={managers()}>
          {(manager) => (
            <A href={`/manager/${manager.id}`} class="group relative block">
              <span class="absolute inset-0 border-2 border-dashed border-black"></span>

              <div class="relative h-full w-full transform border-2 border-black bg-white transition-transform group-hover:-translate-x-2 group-hover:-translate-y-2">
                <div class="flex p-4">
                  {/* Content */}
                  <span class="flex space-x-4 text-sm">
                    <Show when={manager.imageSlug} keyed>
                      {(slug) => (
                        <img
                          alt={manager.lastName}
                          class="avatar h-10 object-cover"
                          src={slug}
                        />
                      )}
                    </Show>
                  </span>
                  <span class="flex w-full flex-col space-y-1">
                    {manager.firstName} {manager.lastName}
                  </span>
                </div>
              </div>
            </A>
          )}
        </For>
      </div>

      <div class="flex flex-col">
        <span class="my-4 text-2xl font-bold">Team</span>
        <For each={teams()}>
          {(team) => (
            <A href={`/team/${team.id}`} class="group relative block w-full">
              <span class="absolute inset-0 border-2 border-dashed border-black"></span>

              <div class="relative h-full w-full transform border-2 border-black bg-white transition-transform group-hover:-translate-x-2 group-hover:-translate-y-2">
                <div class="flex justify-between p-4">
                  {/* Content */}
                  <span class="flex space-x-6 align-middle text-sm">
                    <Show when={team.imageSlug} keyed>
                      {(slug) => (
                        <img
                          alt={team.name}
                          class="avatar h-10 object-cover"
                          src={slug}
                        />
                      )}
                    </Show>
                  </span>
                  <span class="w-full self-center text-center">
                    {team.name}
                  </span>
                </div>
              </div>
            </A>
          )}
        </For>
      </div>
    </div>
  );
};
