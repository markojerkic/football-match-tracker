import { ErrorBoundary, Resource, Show, createRenderEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { RouteDataArgs, Title, useRouteData } from "solid-start";
import {
  HttpStatusCode,
  createServerAction$,
  createServerData$,
} from "solid-start/server";
import { Option } from "~/components/form-helpers";
import { ImageOrDefaultAvater, PlayerInfoForm } from "~/components/player";
import { OptionWithImage, getCountries } from "~/server/country";
import {
  PlayerManagerForm,
  getPlayerFormData,
  saveOrUpdatePlayer,
} from "~/server/players";
import { getAllTeams } from "~/server/teams";

export const routeData = ({ params }: RouteDataArgs<{ id: string }>) => {
  return createServerData$(([, id]) => getPlayerFormData(id), {
    key: () => ["player-form-data", params.id],
  });
};

export default () => {
  const playerData = useRouteData<typeof routeData>();

  const [player, setPlayer] = createStore<PlayerManagerForm>({
    id: undefined,
    nationality: "",
    firstName: "",
    lastName: "",
    dateOfBirth: new Date(),
    imageSlug: undefined,
    currentTeam: undefined,
  });

  createRenderEffect(() => {
    const player = playerData();
    if (player) {
      setPlayer(player);
    }
  });

  const [status, { Form }] = createServerAction$(async (formData: FormData) => {
    const playerInfo = Object.fromEntries(formData.entries());

    return saveOrUpdatePlayer(playerInfo);
  });

  const teams: Resource<Option[]> = createServerData$(() => getAllTeams(), {
    key: () => ["teams"],
    initialValue: [],
  });

  const countries: Resource<OptionWithImage[]> = createServerData$(
    () => getCountries(),
    {
      key: () => ["countries"],
      initialValue: [],
    }
  );

  const playerName = () => {
    const player = playerData();

    if (!player) return "Edit player";
    return `Edit ${player.firstName} ${player.firstName}`;
  };

  return (
    <ErrorBoundary
      fallback={(e) => (
        <>
          <HttpStatusCode code={404} />
          <Title>Player not found</Title>
          <div class="mx-auto max-w-screen-md rounded-md bg-error p-4 text-white">
            <span>
              Player with the given id was not found. Please try another id.{" "}
              {e.message}
            </span>
          </div>
        </>
      )}
    >
      <Show when={status.error} keyed>
        {(e) => (
          <div class="mx-auto max-w-screen-md rounded-md bg-error p-4 text-white">
            <span>Error saving player with message: {e.message}.</span>
          </div>
        )}
      </Show>

      <Title>{playerName()}</Title>

      <div class="mx-auto flex w-[90%] flex-col justify-center space-y-4 border-2 border-black p-4 md:w-[50%]">
        <span class="text-xl font-semibold">Add new player</span>

        <ImageOrDefaultAvater imageSlug={player.imageSlug} />

        <Form class="group flex flex-col justify-center space-y-4">
          <PlayerInfoForm
            teams={teams() ?? []}
            setPlayer={setPlayer}
            player={player}
            countries={countries() ?? []}
          />
        </Form>
      </div>
    </ErrorBoundary>
  );
};
