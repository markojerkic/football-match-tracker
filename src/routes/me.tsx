import { For } from "solid-js";
import { useRouteData } from "solid-start";
import { createServerAction$, createServerData$ } from "solid-start/server";
import { PlayerPreview } from "~/components/player";
import { TeamPreview } from "~/components/teams";
import { getUserData, logout } from "~/server/auth";
import { getFavouritePlayers } from "~/server/players";
import { getFavouriteTeams } from "~/server/teams";

export const routeData = () => {
  const userData = createServerData$((_, { request }) => getUserData(request), {
    key: () => ["me"],
  });

  const favouritePlayers = createServerData$(
    (_, { request }) => getFavouritePlayers(request),
    {
      key: () => ["favourite-players"],
    }
  );

  const favouriteTeams = createServerData$(
    (_, { request }) => getFavouriteTeams(request),
    {
      key: () => ["favourite-teams"],
    }
  );

  return {
    userData,
    favouritePlayers,
    favouriteTeams,
  };
};

export default () => {
  const { userData, favouriteTeams, favouritePlayers } =
    useRouteData<typeof routeData>();

  const [, { Form }] = createServerAction$(async (_: FormData, { request }) => {
    return logout(request);
  });

  return (
    <div class="mx-auto flex w-[90%] flex-col border-2 border-black p-4 md:w-[50%]">
      <div class="flex justify-between">
        <span class="font-2xl font-bold">
          {`${userData()?.firstName} ${userData()?.lastName}`}
        </span>
        <Form>
          <button type="submit" class="btn">
            Log out
          </button>
        </Form>
      </div>

      <div class="mt-6 flex w-full flex-col md:flex-row md:justify-around">
        <div class="flex flex-col space-y-4">
          <p>Favourite teams</p>
          <For each={favouriteTeams()}>
            {(team) => (
              <TeamPreview
                name={team.team.name}
                id={team.team.id}
                imageSlug={team.team.imageSlug}
              />
            )}
          </For>
        </div>

        <div class="flex flex-col space-y-4">
          <p>Favourite players</p>
          <For each={favouritePlayers()}>
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
      </div>
    </div>
  );
};
