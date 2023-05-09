import { Outlet, useNavigate, useRouteData } from "solid-start";
import { isAdmin } from "~/server/auth";
import { createServerData$, redirect } from "solid-start/server";
import { createEffect } from "solid-js";

export const routeData = () => {
  return createServerData$(
    async (_, { request }) => {
      return isAdmin(request);
    },
    {
      key: () => ["is-not-admin"],
      deferStream: true,
    }
  );
};

export default () => {
  const is = useRouteData<typeof routeData>();
  const navigate = useNavigate();

  createEffect(() => {
    console.log(is.loading);
    if (!is.loading && !is()) {
      navigate("/login");
    }
  });

  return <Outlet />;
};
