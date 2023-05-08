import { Resource, createRenderEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { RouteDataArgs, Title, useRouteData } from "solid-start";
import { createServerAction$, createServerData$ } from "solid-start/server";
import { TeamInfoForm } from "~/components/teams";
import { OptionWithImage, getCountries } from "~/server/country";
import {
  TeamForm,
  getTeamForm,
  saveOrUpdateTeam,
  teamSchema,
} from "~/server/teams";

export const routeData = ({ params }: RouteDataArgs) => {
  return createServerData$(([, id]) => getTeamForm(id), {
    key: () => ["team-form", params.id],
    deferStream: true,
  });
};

export default () => {
  const teamInfo = useRouteData<typeof routeData>();

  const [team, setTeam] = createStore<TeamForm>({
    id: undefined,
    country: "",
    name: "",
    primaryShirtColor: "",
    imageSlug: undefined,
  });

  createRenderEffect(() => {
    const ti = teamInfo();
    if (ti) {
      setTeam({ ...ti });
    }
  });

  const [, { Form }] = createServerAction$(async (formData: FormData) => {
    const team = teamSchema.parse(formData);

    return saveOrUpdateTeam(team);
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
      <Title>Add new team</Title>

      <div class="mx-auto flex w-[90%] flex-col justify-center space-y-4 border-2 border-black p-4 md:w-[50%]">
        <span class="text-xl font-semibold">Add new team</span>

        <img
          src={team.imageSlug ?? "/shield.svg"}
          class="avatar mx-auto h-16 object-contain"
        />

        <Form class="group flex flex-col justify-center space-y-4">
          <TeamInfoForm
            setTeam={setTeam}
            team={team}
            countries={countries() ?? []}
          />
        </Form>
      </div>
    </>
  );
};
