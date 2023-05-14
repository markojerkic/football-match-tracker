import { SetStoreFunction } from "solid-js/store";
import { A } from "solid-start";
import { OptionWithImage } from "~/server/country";
import { TeamForm } from "~/server/teams";
import { Select, TextInput } from "./form-helpers";
import { ColorPicker } from "./game-edit";
import { Show } from "solid-js";

export const TeamInfoForm = (props: {
  team: TeamForm;
  setTeam: SetStoreFunction<TeamForm>;
  countries: OptionWithImage[];
}) => {
  return (
    <>
      <span class="grid grid-cols-2 gap-2">
        <input type="hidden" name="id" value={props.team.id ?? ""} />
        <TextInput
          required
          name="name"
          label="Team name"
          control={{
            setValue: (val) => props.setTeam({ name: val }),
            value: props.team.name,
          }}
        />

        <Select
          name="country"
          label="Country"
          options={props.countries}
          required
          control={{
            value: props.team.country,
            setValue: (val) => props.setTeam({ country: val }),
          }}
        />

        <TextInput
          required={false}
          name="imageSlug"
          label="Image URL"
          type="url"
          control={{
            setValue: (val) => props.setTeam({ imageSlug: val }),
            value: props.team.imageSlug,
          }}
        />

        <ColorPicker
          name="primaryShirtColor"
          value={props.team.primaryShirtColor}
          control={(val) => props.setTeam({ primaryShirtColor: val })}
          label="Primary shirt color"
        />
      </span>

      <button class="btn group-invalid:btn-disabled" type="submit">
        Save
      </button>
    </>
  );
};

export const TeamPreview = (team: {
  name: string;
  id: string;
  imageSlug: string | null;
  seasonName?: string;
  seasonId?: string;
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
          <Show when={team.seasonId && team.seasonName}>
            <A class="font-thin hover:link" href={`/season/${team.seasonId}`}>
              {team.seasonName}
            </A>
          </Show>
        </span>
      </span>

      <span class="divider" />
    </div>
  );
};
