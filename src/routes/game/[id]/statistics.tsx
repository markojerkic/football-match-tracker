import { RouteDataArgs, useParams, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { GameDetailWrapper } from "~/components/games";
import { prisma } from "~/util/prisma";
import { Show, Suspense } from "solid-js";
import { stat } from "fs";

export const routeData = ({ params }: RouteDataArgs) => {
  return createServerData$(
    ([, gameId]) => {
      return prisma.gameStatistics.findUnique({
        where: {
          gameId: gameId,
        },
      });
    },
    { key: () => ["game-statistics", params.id] }
  );
};

const Statistic = (statistic: {
  label: string;
  homeTeam: number;
  awayTeam: number;
  unit?: string;
}) => {
  const total = () => statistic.homeTeam + statistic.awayTeam;
  const homeTeamPercentage = () => (statistic.homeTeam / total()) * 100;
  const awayTeamPercentage = () => (statistic.awayTeam / total()) * 100;

  return (
    <Show when={statistic.awayTeam !== -1 && statistic.homeTeam !== -1}>
      <div class="flex w-full flex-col">
        <p class="w-full text-center font-bold">{statistic.label}</p>
        <p class="flex w-full justify-between font-semibold">
          <span>
            {statistic.homeTeam}
            {statistic.unit}
          </span>
          <span>
            {statistic.awayTeam}
            {statistic.unit}
          </span>
        </p>
        <p class="flex justify-center">
          <progress
            class="progress mr-[-2.5px] w-[40%] rotate-180"
            value={homeTeamPercentage()}
            max="100"
          />
          <progress
            class="progress ml-[-2.5px] w-[40%]"
            value={awayTeamPercentage()}
            max="100"
          />
        </p>
      </div>
    </Show>
  );
};

export default () => {
  const statistics = useRouteData<typeof routeData>();

  const params = useParams();
  const gameId = () => params.id;

  return (
    <GameDetailWrapper tab="timeline" gameId={gameId()}>
      <Suspense>
        <Show when={statistics()} keyed>
          {(statistics) => (
            <div class="flex flex-col space-y-2 divide-y-2 divide-dashed divide-base-300">
              <Statistic
                label="Possesion"
                homeTeam={statistics.homeTeamBallPossession}
                awayTeam={statistics.awayTeamBallPossession}
                unit="%"
              />
              <Statistic
                label="Total Shots"
                homeTeam={statistics.homeTeamTotalShots}
                awayTeam={statistics.awayTeamTotalShots}
              />
              <Statistic
                label="Shots on Target"
                homeTeam={statistics.homeTeamShotsOnTarget}
                awayTeam={statistics.awayTeamShotsOnTarget}
              />
              <Statistic
                label="Corner Kicks"
                homeTeam={statistics.homeTeamCornerKicks}
                awayTeam={statistics.awayTeamCornerKicks}
              />
              <Statistic
                label="Fouls commited"
                homeTeam={statistics.homeTeamFouls}
                awayTeam={statistics.awayTeamFouls}
              />
              <Statistic
                label="Crosses"
                homeTeam={statistics.homeTeamCrosses}
                awayTeam={statistics.awayTeamCrosses}
              />
              <Statistic
                label="Passes"
                homeTeam={statistics.homeTeamPasses}
                awayTeam={statistics.awayTeamPasses}
              />
              <Statistic
                label="Tackles"
                homeTeam={statistics.homeTeamTackles}
                awayTeam={statistics.awayTeamTackles}
              />
              <Statistic
                label="Dribbles"
                homeTeam={statistics.homeTeamDribles}
                awayTeam={statistics.awayTeamDribles}
              />
              <Statistic
                label="Sucessful Dribbles"
                homeTeam={statistics.homeTeamDriblesSucessful}
                awayTeam={statistics.awayTeamDriblesSucessful}
              />
              <Statistic
                label="Offsides"
                homeTeam={statistics.homeTeamOffsides}
                awayTeam={statistics.awayTeamOffsides}
              />
            </div>
          )}
        </Show>
      </Suspense>
    </GameDetailWrapper>
  );
};
