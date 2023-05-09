import { ParentComponent, Show, children } from "solid-js";
import { createServerData$ } from "solid-start/server";
import { isUserLoggedIn } from "~/server/auth";

export const LoggedInOnly: ParentComponent = (props) => {
  const loggedInOnlyComponent = children(() => props.children);
  const isLoggedIn = createServerData$((_, { request }) => isUserLoggedIn(request), {
    key: () => ["is-logged-in"],
  })

  return (
    <>
      <Show when={isLoggedIn()}>
        {loggedInOnlyComponent()}
      </Show>
    </>
  )
}
