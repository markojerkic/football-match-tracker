import { Resource } from "solid-js";
import { createStore } from "solid-js/store";
import { Title } from "solid-start";
import { createServerAction$, createServerData$ } from "solid-start/server";
import { type Option } from "~/components/form-helpers";
import { ImageOrDefaultAvater, PlayerInfoForm as PlayerManagerInfoForm } from "~/components/player";
import { OptionWithImage, getCountries } from "~/server/country";
import { saveOrUpdateManager } from "~/server/managers";
import { PlayerManagerForm } from "~/server/players";
import { getAllTeams } from "~/server/teams";

export default () => {
  const [manager, setManager] = createStore<PlayerManagerForm>({
    id: undefined,
    nationality: "",
    firstName: "",
    lastName: "",
    dateOfBirth: new Date(),
    imageSlug: undefined,
    currentTeam: undefined,
  });

  const [, { Form }] = createServerAction$(async (formData: FormData) => {
    const managerInfo = Object.fromEntries(formData.entries());

    return saveOrUpdateManager(managerInfo);
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
      <Title>Add manager</Title>

      <div class="mx-auto flex w-[90%] flex-col justify-center space-y-4 border-2 border-black p-4 md:w-[50%]">
        <span class="text-xl font-semibold">Add new manager</span>

        <ImageOrDefaultAvater imageSlug={manager.imageSlug} />

        <Form class="group flex flex-col justify-center space-y-4">
          <PlayerManagerInfoForm
            teams={teams() ?? []}
            setPlayer={setManager}
            player={manager}
            countries={countries() ?? []}
          />
        </Form>
      </div>
    </>
  );
};
