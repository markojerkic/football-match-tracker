import { createServerData$ } from "solid-start/server";
import { isAdmin } from "~/server/auth";

export const isUserAdmin  = createServerData$((_, { request }) => isAdmin(request), {
  key: () => ["is-admin"],
  initialValue: false
})
