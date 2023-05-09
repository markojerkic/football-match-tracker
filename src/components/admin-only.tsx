import { ParentComponent, Show, children } from "solid-js";
import {createServerData$} from "solid-start/server";
import { isAdmin } from "~/server/auth";

export const AdminOnly: ParentComponent = (props) => {
  const adminOnlyComponent = children(() => props.children);
  const isUserAdmin = createServerData$((_, { request }) => isAdmin(request), {
    key: () => ["is-admin"],
  })

  return (
    <>
      <Show when={isUserAdmin()}>
        {adminOnlyComponent()}
      </Show>
    </>
  )
}
