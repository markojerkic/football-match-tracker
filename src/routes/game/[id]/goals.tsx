import { RouteDataArgs, useParams, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import GameDetail from "~/components/game-detail";
import { GameDetailWrapper } from "~/components/games";
import { getCardsFromGame } from "~/server/cards";
import { getGameGoalsById } from "~/server/games";

export const routeData = ({ params }: RouteDataArgs<{ id: string }>) => {
  return createServerData$(
    async ([, gameId]) => {
      const [goals, cards] = await Promise.all([
        getGameGoalsById(gameId),
        getCardsFromGame(gameId),
      ]);
      return { goals, cards };
    },
    {
      key: () => ["goals-in-game", params.id],
      initialValue: {
        goals: [],
        cards: [],
      },
    }
  );
};

export default () => {
  const data = useRouteData<typeof routeData>();
  const id = useParams().id;

  const goals = () => data()?.goals ?? [];
  const cards = () => data()?.cards ?? [];

  return (
    <GameDetailWrapper gameId={id}>
      <GameDetail goals={goals()} cards={cards()} />
    </GameDetailWrapper>
  );
};
