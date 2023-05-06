import { A, Outlet } from "solid-start";
import { activeStyle, inactiveStyle } from "./games";
import { Show, Suspense } from "solid-js";
import { CurrentTeam, ImageOrDefaultAvater } from "./player";

export const ManagerDetail = (detail: {
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
      {/* FIXME: only admins can see this */}
      <div class="flex grow justify-end">
        <A
          href={`/admin/manager/${detail.id}`}
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

      <TabSelector managerId={detail.id} />

      <div class="w-full px-4">
        <Suspense fallback={<>Loading...</>}>
          <Outlet />
        </Suspense>
      </div>
    </article>
  );
};

const TabSelector = (props: { managerId: string }) => {
  return (
    <div class="flex flex-col space-y-4">
      <div class="flex border-b border-gray-400 text-center">
        <Tab route="teams" label="Tems per season" id={props.managerId} />
        <Tab route="games" label="Games" id={props.managerId} />
      </div>
    </div>
  );
};

const Tab = (props: { label: string; id: string; route: string }) => {
  return (
    <span class="flex-1">
      <A
        end={true}
        href={`/manager/${props.id}/${props.route}`}
        activeClass={activeStyle}
        inactiveClass={inactiveStyle}
      >
        <span class="absolute inset-x-0 -bottom-px h-px w-full bg-white"></span>
        {props.label}
      </A>
    </span>
  );
};
