import { Match, Switch } from "solid-js";

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

export const PlayerDetail = (detail: {
  id: string;
  firstName: string;
  lastName: string;
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
      <div class="avatar mx-auto h-20 rounded-full bg-gray-400 p-4 ring ring-black ring-offset-2">
        <PerssonIcon />
      </div>
      <h3 class="text-center text-3xl font-semibold">{`${detail.firstName} ${detail.lastName}`}</h3>

      <span class="divider" />

      <div>
        <Switch>
          <Match when={detail.currentTeam} keyed>
            {(currentTeam) => <>{JSON.stringify(currentTeam)}</>}
          </Match>
        </Switch>
      </div>
    </article>
  );
};
