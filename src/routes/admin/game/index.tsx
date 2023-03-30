// @refresh reload
import { useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { prisma } from "~/util/prisma";
//const GameEdit = unstable_island(() => import("../../../components/game-edit"));
import GameEdit from "~/components/game-edit";

export const routeData = () => {
  return createServerData$(
    async () => {
      return prisma.competition
        .findMany({
          select: {
            id: true,
            name: true,
            country: {
              select: {
                name: true,
              },
            },
          },
        })
        .then((competitions) =>
          competitions.map((c) => ({
            label: `${c.country.name} - ${c.name}`,
            value: c.id,
          }))
        );
    },
    { key: () => ["admin-competitions"], initialValue: [] }
  );
};

export default () => {
  const competitions = useRouteData<typeof routeData>();
  const nonEmptyCompetitions = () => competitions() ?? [];

  return <GameEdit competitions={nonEmptyCompetitions()} />;
};
