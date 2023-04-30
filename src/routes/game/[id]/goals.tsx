import { RouteDataArgs, useParams, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import GameDetail from "~/components/game-detail";
import { GameDetailWrapper } from "~/components/games";
import { getCardsFromGame } from "~/server/cards";
import { getGameGoalsById } from "~/server/games";
import { getSubsFromGame } from "~/server/substitutions";

export const routeData = ({ params }: RouteDataArgs<{ id: string }>) => {
  return createServerData$(
    async ([, gameId]) => {
      const [goals, cards, subs] = await Promise.all([
        getGameGoalsById(gameId),
        getCardsFromGame(gameId),
        getSubsFromGame(gameId),
      ]);
      return { goals, cards, subs };
    },
    {
      key: () => ["goals-in-game", params.id],
      initialValue: {
        goals: [],
        cards: [],
        subs: [],
      },
    }
  );
};

export default () => {
  const data = useRouteData<typeof routeData>();
  const id = useParams().id;

  const goals = () => data()?.goals ?? [];
  const cards = () => data()?.cards ?? [];
  const substitutions = () => data()?.subs ?? [];

  return (
    <GameDetailWrapper gameId={id}>
      <GameDetail
        goals={goals()}
        cards={cards()}
        substitutions={substitutions()}
      />
    </GameDetailWrapper>
  );
};
