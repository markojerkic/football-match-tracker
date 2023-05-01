import { GameStatistics } from "@prisma/client";
import { Show } from "solid-js";
import { SetStoreFunction } from "solid-js/store";

export const Statistic = (statistic: {
  label: string;
  homeTeam: number;
  awayTeam: number;
  unit?: string;
}) => {
  const total = () => statistic.homeTeam + statistic.awayTeam;
  const homeTeamPercentage = () =>
    statistic.homeTeam === 0 ? 0 : (statistic.homeTeam / total()) * 100;
  const awayTeamPercentage = () =>
    statistic.awayTeam === 0 ? 0 : (statistic.awayTeam / total()) * 100;

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

export type StatisticsForm = Omit<GameStatistics, "id" | "gameId"> & {
  id: string | undefined;
};
export const defaultStatisticsFrom = (): StatisticsForm => ({
  id: undefined,
  homeTeamBallPossession: 0,
  homeTeamTotalShots: 0,
  homeTeamShotsOnTarget: 0,
  homeTeamCornerKicks: 0,
  homeTeamOffsides: 0,
  homeTeamFouls: 0,
  homeTeamBigChances: 0,
  homeTeamPasses: 0,
  homeTeamCrosses: 0,
  homeTeamTackles: 0,
  homeTeamDribles: 0,
  homeTeamDriblesSucessful: 0,
  awayTeamBallPossession: 0,
  awayTeamTotalShots: 0,
  awayTeamShotsOnTarget: 0,
  awayTeamCornerKicks: 0,
  awayTeamOffsides: 0,
  awayTeamFouls: 0,
  awayTeamBigChances: 0,
  awayTeamPasses: 0,
  awayTeamCrosses: 0,
  awayTeamTackles: 0,
  awayTeamDribles: 0,
  awayTeamDriblesSucessful: 0,
});

const SingleStatisticEditor = (control: {
  name: string;
  valueHomeTeam: number;
  homeTeamMin?: number;
  homeTeamMax?: number;
  updateHomeTeam: (val: number) => void;
  valueAwayTeam: number;
  awayTeamMin?: number;
  awayTeamMax?: number;
  updateAwayTeam: (val: number) => void;
  label: string;
  unit?: string;
}) => {
  return (
    <>
      <div class="grid grid-cols-2 justify-items-center">
        <label for={`${control.name}HomeTeam`}>Home team</label>
        <label for={control.name}>Away team</label>

        <input
          class="h-12 w-12 text-center invalid:input-error invalid:border"
          type="number"
          name={`${control.name}HomeTeam`}
          min={control.homeTeamMin ?? 0}
          max={control.homeTeamMax}
          onChange={(e) => control.updateHomeTeam(+e.currentTarget.value)}
          value={control.valueHomeTeam}
        />
        <input
          class="h-12 w-12 text-center invalid:input-error invalid:border"
          type="number"
          name={`${control.name}HomeTeam`}
          min={control.awayTeamMin ?? 0}
          max={control.awayTeamMax}
          onChange={(e) => control.updateAwayTeam(+e.currentTarget.value)}
          value={control.valueAwayTeam}
        />
      </div>
      <Statistic
        homeTeam={control.valueHomeTeam}
        awayTeam={control.valueAwayTeam}
        label={control.label}
        unit={control.unit}
      />
    </>
  );
};

export const StatisticEditor = (info: {
  value: StatisticsForm;
  control: SetStoreFunction<StatisticsForm>;
}) => {
  return (
    <div class="flex flex-col">
      <SingleStatisticEditor
        label="Ball possesion"
        name="ballPossesion"
        valueHomeTeam={info.value.homeTeamBallPossession}
        updateHomeTeam={(val) => info.control({ homeTeamBallPossession: val })}
        homeTeamMin={100 - info.value.awayTeamBallPossession}
        homeTeamMax={100 - info.value.awayTeamBallPossession}
        valueAwayTeam={info.value.awayTeamBallPossession}
        updateAwayTeam={(val) => info.control({ awayTeamBallPossession: val })}
        awayTeamMin={100 - info.value.homeTeamBallPossession}
        awayTeamMax={100 - info.value.homeTeamBallPossession}
        unit="%"
      />

      <SingleStatisticEditor
        label="Total shots"
        name="totalShots"
        valueHomeTeam={info.value.homeTeamTotalShots}
        updateHomeTeam={(val) => info.control({ homeTeamTotalShots: val })}
        valueAwayTeam={info.value.awayTeamTotalShots}
        updateAwayTeam={(val) => info.control({ awayTeamTotalShots: val })}
      />

      <SingleStatisticEditor
        label="Shots on target"
        name="shotsOnTarget"
        valueHomeTeam={info.value.homeTeamShotsOnTarget}
        updateHomeTeam={(val) => info.control({ homeTeamShotsOnTarget: val })}
        valueAwayTeam={info.value.awayTeamShotsOnTarget}
        updateAwayTeam={(val) => info.control({ awayTeamShotsOnTarget: val })}
      />

      <SingleStatisticEditor
        label="Offsides"
        name="offsides"
        valueHomeTeam={info.value.homeTeamOffsides}
        updateHomeTeam={(val) => info.control({ homeTeamOffsides: val })}
        valueAwayTeam={info.value.awayTeamOffsides}
        updateAwayTeam={(val) => info.control({ awayTeamOffsides: val })}
      />

      <SingleStatisticEditor
        label="Corner kicks"
        name="cornerKicks"
        valueHomeTeam={info.value.homeTeamCornerKicks}
        updateHomeTeam={(val) => info.control({ homeTeamCornerKicks: val })}
        valueAwayTeam={info.value.awayTeamCornerKicks}
        updateAwayTeam={(val) => info.control({ awayTeamCornerKicks: val })}
      />

      <SingleStatisticEditor
        label="Fouls"
        name="fouls"
        valueHomeTeam={info.value.homeTeamFouls}
        updateHomeTeam={(val) => info.control({ homeTeamFouls: val })}
        valueAwayTeam={info.value.awayTeamFouls}
        updateAwayTeam={(val) => info.control({ awayTeamFouls: val })}
      />

      <SingleStatisticEditor
        label="Big chances"
        name="bigChances"
        valueHomeTeam={info.value.homeTeamBigChances}
        updateHomeTeam={(val) => info.control({ homeTeamBigChances: val })}
        valueAwayTeam={info.value.awayTeamBigChances}
        updateAwayTeam={(val) => info.control({ awayTeamBigChances: val })}
      />

      <SingleStatisticEditor
        label="Passes"
        name="passes"
        valueHomeTeam={info.value.homeTeamPasses}
        updateHomeTeam={(val) => info.control({ homeTeamPasses: val })}
        valueAwayTeam={info.value.awayTeamPasses}
        updateAwayTeam={(val) => info.control({ awayTeamPasses: val })}
      />

      <SingleStatisticEditor
        label="Crosses"
        name="crosses"
        valueHomeTeam={info.value.homeTeamCrosses}
        updateHomeTeam={(val) => info.control({ homeTeamCrosses: val })}
        valueAwayTeam={info.value.awayTeamCrosses}
        updateAwayTeam={(val) => info.control({ awayTeamCrosses: val })}
      />

      <SingleStatisticEditor
        label="Tackles"
        name="tackles"
        valueHomeTeam={info.value.homeTeamTackles}
        updateHomeTeam={(val) => info.control({ homeTeamTackles: val })}
        valueAwayTeam={info.value.awayTeamTackles}
        updateAwayTeam={(val) => info.control({ awayTeamTackles: val })}
      />

      <SingleStatisticEditor
        label="Dribles"
        name="dribles"
        valueHomeTeam={info.value.homeTeamDribles}
        updateHomeTeam={(val) => info.control({ homeTeamDribles: val })}
        valueAwayTeam={info.value.awayTeamDribles}
        updateAwayTeam={(val) => info.control({ awayTeamDribles: val })}
      />

      <SingleStatisticEditor
        label="Sucessful dribles"
        name="dribles"
        valueHomeTeam={info.value.homeTeamDriblesSucessful}
        updateHomeTeam={(val) =>
          info.control({ homeTeamDriblesSucessful: val })
        }
        valueAwayTeam={info.value.awayTeamDriblesSucessful}
        updateAwayTeam={(val) =>
          info.control({ awayTeamDriblesSucessful: val })
        }
      />
    </div>
  );
};
