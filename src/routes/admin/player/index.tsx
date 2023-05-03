import { Resource } from "solid-js";
import { createStore } from "solid-js/store";
import { Title } from "solid-start";
import { createServerAction$, createServerData$ } from "solid-start/server";
import { type Option } from "~/components/form-helpers";
import { ImageOrDefaultAvater, PlayerInfoForm } from "~/components/player";
import { OptionWithImage, getCountries } from "~/server/country";
import { getAllTeams } from "~/server/teams";

export type PlayerForm = {
  id: string | undefined;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  nationality: string;
  imageSlug: string | undefined;
  currentTeam: string | undefined;
};

export default () => {
  const [player, setPlayer] = createStore<PlayerForm>({
    id: undefined,
    nationality: "",
    firstName: "",
    lastName: "",
    dateOfBirth: new Date(),
    imageSlug: undefined,
    currentTeam: undefined,
  });

  const [, { Form }] = createServerAction$(async (formData: FormData) => {
    const playerInfo = Object.fromEntries(formData.entries());
    console.log(playerInfo);
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

  return (
    <>
      <Title>Add player</Title>

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
    </>
  );
};
