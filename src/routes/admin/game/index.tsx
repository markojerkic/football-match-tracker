// @refresh reload
import { useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import GameEdit from "~/components/game-edit";
import { getCompetitionOptions } from "~/server/competitions";

export const routeData = () => {
  return createServerData$(async () => getCompetitionOptions(), {
    key: () => ["admin-competitions"],
    initialValue: [],
  });
};

export default () => {
  const competitions = useRouteData<typeof routeData>();
  const nonEmptyCompetitions = () => competitions() ?? [];

  return <GameEdit competitions={nonEmptyCompetitions()} />;
};
