import { useRouteData } from "solid-start";
import { createServerAction$, createServerData$ } from "solid-start/server";
import { getUserData, logout } from "~/server/auth";

export const routeData = () => {
  const userData = createServerData$((_, { request }) => getUserData(request), {
    key: () => ["me"],
  });

  return userData;
};

export default () => {
  const userData = useRouteData<typeof routeData>();

  const [, { Form }] = createServerAction$(async (_: FormData, { request }) => {
    return logout(request);
  });

  return (
    <div class="mx-auto flex w-[90%] justify-between border-2 border-black p-4 md:w-[50%]">
      <span class="font-2xl font-bold">
        {`${userData()?.firstName} ${userData()?.lastName}`}
      </span>
      <Form>
        <button type="submit" class="btn">
          Log out
        </button>
      </Form>
    </div>
  );
};
