import {
  Match,
  Show,
  Suspense,
  Switch,
  createEffect,
  createSignal,
} from "solid-js";
import { TextInput, type Option, Select, DateSelector } from "./form-helpers";
import { SetStoreFunction } from "solid-js/store";
import { OptionWithImage } from "~/server/country";
import { PlayerManagerForm } from "~/server/players";
import { A } from "solid-start";
import { Outlet } from "solid-start/router";
import { activeStyle, inactiveStyle } from "./games";
import { AdminOnly } from "./admin-only";
import { FavouritePlayer } from "./favourite";
import { LoggedInOnly } from "./logged-in-only";

const PerssonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    class="h-full w-full"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
    />
  </svg>
);

const WrappedNoIcon = () => {
  return (
    <div class="avatar mx-auto h-20 rounded-full bg-gray-400 p-4 ring ring-black ring-offset-2">
      <PerssonIcon />
    </div>
  );
};
export const ImageOrDefaultAvater = (props: {
  imageSlug: string | undefined;
}) => {
  const [isError, setIsError] = createSignal(false);

  createEffect(() => {
    console.log("Url", props.imageSlug);
    setIsError(false);
  });

  return (
    <Show
      when={!isError() && props.imageSlug}
      fallback={<WrappedNoIcon />}
      keyed
    >
      {(img) => (
        <div class="avatar mx-auto h-20 w-20 rounded-full ring ring-black ring-offset-2">
          <img
            src={img}
            class="avatar rounded-full object-fill"
            onError={() => setIsError(true)}
          />
        </div>
      )}
    </Show>
  );
};

export const PlayerInfoForm = (props: {
  teams: Option[];
  player: PlayerManagerForm;
  setPlayer: SetStoreFunction<PlayerManagerForm>;
  countries: OptionWithImage[];
}) => {
  const formSafeDateOfBirth = () => {
    try {
      return props.player.dateOfBirth.toJSON().split("T")[0];
    } catch (e) {
      return new Date().toJSON().split("T")[0];
    }
  };

  return (
    <>
      <span class="grid grid-cols-2 gap-2">
        <input type="hidden" name="id" value={props.player.id ?? ""} />
        <TextInput
          required
          name="firstName"
          label="First name"
          control={{
            setValue: (val) => props.setPlayer({ firstName: val }),
            value: props.player.firstName,
          }}
        />

        <TextInput
          required
          name="lastName"
          label="Last name"
          control={{
            setValue: (val) => props.setPlayer({ lastName: val }),
            value: props.player.lastName,
          }}
        />

        <TextInput
          required={false}
          name="imageSlug"
          label="Image URL"
          type="url"
          control={{
            setValue: (val) => props.setPlayer({ imageSlug: val }),
            value: props.player.imageSlug,
          }}
        />
      </span>

      <DateSelector
        name="dateOfBirth"
        label="Date of birth"
        control={{
          setValue: (val) =>
            props.setPlayer({
              dateOfBirth: new Date(val as string),
            }),
          value: formSafeDateOfBirth(),
        }}
        type="date"
      />

      <span class="grid grid-cols-2 gap-2">
        <Select
          name="nationality"
          label="Nationality"
          options={props.countries}
          required
          control={{
            value: props.player.nationality,
            setValue: (val) => props.setPlayer({ nationality: val }),
          }}
        />

        <Select
          name="currentTeam"
          label="Current team"
          options={props.teams}
          required={false}
          control={{
            value: props.player.currentTeam,
            setValue: (val) => props.setPlayer({ currentTeam: val }),
          }}
        />
      </span>

      <button class="btn group-invalid:btn-disabled" type="submit">
        Save
      </button>
    </>
  );
};

export const PlayerDetail = (detail: {
  id: string;
  firstName: string;
  lastName: string;
  imageSlug: string | undefined;
  currentTeam:
  | {
    id: string;
    name: string;
    imageSlug: string | null;
  }
  | undefined;
}) => {
  return (
    <article class="mx-auto flex w-[90%] flex-col justify-center space-y-4 border-2 border-black p-4 md:w-[50%]">

      <AdminOnly>
        <div class="flex grow justify-end">
          <A
            href={`/admin/player/${detail.id}`}
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

      <LoggedInOnly>
        <FavouritePlayer id={detail.id} />
      </LoggedInOnly>

      <ImageOrDefaultAvater imageSlug={detail.imageSlug} />
      <h3 class="text-center text-3xl font-semibold">{`${detail.firstName} ${detail.lastName}`}</h3>

      <span class="divider" />

      <div>
        <Show
          when={detail.currentTeam}
          fallback={<CurrentTeam name={"Unkown"} id={null} imageSlug={null} />}
          keyed
        >
          {(currentTeam) => (
            <CurrentTeam
              name={currentTeam.name}
              id={currentTeam.id}
              imageSlug={currentTeam.imageSlug}
            />
          )}
        </Show>
      </div>

      <span class="divider" />

      <TabSelector playerId={detail.id} />

      <div class="w-full px-4">
        <Suspense fallback={<>Loading...</>}>
          <Outlet />
        </Suspense>
      </div>
    </article>
  );
};

const TabSelector = (props: { playerId: string }) => {
  return (
    <div class="flex flex-col space-y-4">
      <div class="flex border-b border-gray-400 text-center">
        <Tab route="teams" label="Tems per season" id={props.playerId} />
        <Tab route="games" label="Games" id={props.playerId} />
      </div>
    </div>
  );
};

const Tab = (props: { label: string; id: string; route: string }) => {
  return (
    <span class="flex-1">
      <A
        end={true}
        href={`/player/${props.id}/${props.route}`}
        activeClass={activeStyle}
        inactiveClass={inactiveStyle}
      >
        <span class="absolute inset-x-0 -bottom-px h-px w-full bg-white"></span>
        {props.label}
      </A>
    </span>
  );
};

export const CurrentTeam = (team: {
  name: string | null;
  id: string | null;
  imageSlug: string | null;
}) => {
  return (
    <div class="flex flex-col space-y-4">
      <span class="font-thin">Current team</span>
      <A class="flex items-center space-x-4" href={`/team/${team.id}`}>
        <img
          src={team.imageSlug ?? "/shield.svg"}
          class="avatar h-16 object-cover"
        />
        <span class="font-semibold">{team.name}</span>
      </A>
    </div>
  );
};

export const BasicPlayerDetail = (detail: {
  id: string;
  firstName: string;
  lastName: string;
  imageSlug: string | undefined;
  currentTeam:
  | {
    id: string;
    name: string;
    imageSlug: string | null;
  }
  | undefined;
}) => {
  return (
    <article class="mx-auto flex w-[90%] flex-col justify-center space-y-4 border-2 border-black p-4 md:w-[50%]">
      <ImageOrDefaultAvater imageSlug={detail.imageSlug} />
      <h3 class="text-center text-3xl font-semibold">{`${detail.firstName} ${detail.lastName}`}</h3>

      <span class="divider" />

      {/*
      <div>
        <Show when={detail.currentTeam} fallback={
          <CurrentTeam
            name={"Unkown"}
            id={null}
            imageSlug={null}
          />
        } keyed>
          {(currentTeam) => (
            <CurrentTeam
              name={currentTeam.name}
              id={currentTeam.id}
              imageSlug={currentTeam.imageSlug}
            />
          )}
        </Show>
      </div>
      */}
    </article>
  );
};
