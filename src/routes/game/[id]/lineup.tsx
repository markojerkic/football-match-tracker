import { Show } from "solid-js";
import { A, RouteDataArgs, useParams, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { GameDetailWrapper } from "~/components/games";
import { FieldWrapper } from "~/components/lineup";
import { ImageOrDefaultAvater } from "~/components/player";
import { getLineups } from "~/server/lineups";

export const routeData = ({ params }: RouteDataArgs) => {
  return createServerData$(([, id]) => getLineups({ gameId: id }), {
    key: () => ["lineups", params.id],
  });
};

export default () => {
  const lineups = useRouteData<typeof routeData>();
  const params = useParams();
  const id = () => params.id;

  return (
    <Show when={lineups()} keyed>
      {(lineups) => (
        <GameDetailWrapper gameId={id()}>
          <p class="mb-0">Home team manager</p>
          <A
            class="border-1 flex justify-start space-x-4 border border-black p-4"
            href={`/manager/${lineups.homeTeamManager.id}`}
          >
            <ImageOrDefaultAvater
              small={true}
              imageSlug={lineups.homeTeamManager.imageSlug}
            />
            <p class="self-center font-semibold">
              {`${lineups.homeTeamManager.firstName} ${lineups.homeTeamManager.lastName}`}
            </p>
          </A>
          <FieldWrapper lineups={lineups} />
          <p class="mb-0">Away team manager</p>
          <A
            class="border-1 flex justify-start space-x-4 border border-black p-4"
            href={`/manager/${lineups.awayTeamManager.id}`}
          >
            <ImageOrDefaultAvater
              small={true}
              imageSlug={lineups.awayTeamManager.imageSlug}
            />
            <p class="self-center font-semibold">
              {`${lineups.awayTeamManager.firstName} ${lineups.awayTeamManager.lastName}`}
            </p>
          </A>
        </GameDetailWrapper>
      )}
    </Show>
  );
};
