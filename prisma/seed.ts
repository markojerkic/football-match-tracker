import {
  CompetitionType,
  Halftime,
  Position,
  PrismaClient,
} from "@prisma/client";
import { z } from "zod";
import { PathOrFileDescriptor, readFileSync } from "fs";

let prisma = new PrismaClient();

const playersSchema = z.object({
  full_name: z.string(),
  age: z.number(),
  birthday: z.number(),
  birthday_GMT: z.string(),
  league: z.string(),
  season: z.string(),
  position: z.string(),
  "Current Club": z.string(),
  minutes_played_overall: z.number(),
  minutes_played_home: z.number(),
  minutes_played_away: z.number(),
  nationality: z.string(),
  appearances_overall: z.number(),
  appearances_home: z.number(),
  appearances_away: z.number(),
  goals_overall: z.number(),
  goals_home: z.number(),
  goals_away: z.number(),
  assists_overall: z.number(),
  assists_home: z.number(),
  assists_away: z.number(),
  penalty_goals: z.number(),
  penalty_misses: z.number(),
  clean_sheets_overall: z.number(),
  clean_sheets_home: z.number(),
  clean_sheets_away: z.number(),
  conceded_overall: z.number(),
  conceded_home: z.number(),
  conceded_away: z.number(),
  yellow_cards_overall: z.number(),
  red_cards_overall: z.number(),
  goals_involved_per_90_overall: z.number(),
  assists_per_90_overall: z.number(),
  goals_per_90_overall: z.number(),
  goals_per_90_home: z.number(),
  goals_per_90_away: z.number(),
  min_per_goal_overall: z.number(),
  conceded_per_90_overall: z.number(),
  min_per_conceded_overall: z.number(),
  min_per_match: z.number(),
  min_per_card_overall: z.number(),
  min_per_assist_overall: z.number(),
  cards_per_90_overall: z.number(),
  rank_in_league_top_attackers: z.number(),
  rank_in_league_top_midfielders: z.number(),
  rank_in_league_top_defenders: z.number(),
  rank_in_club_top_scorer: z.number(),
  average_rating_overall: z.string(),
  assists_per_game_overall: z.string(),
  sm_assists_total_overall: z.string(),
  assists_per90_percentile_overall: z.string(),
  passes_per_90_overall: z.string(),
  passes_per_game_overall: z.string(),
  passes_per90_percentile_overall: z.string(),
  passes_total_overall: z.string(),
  passes_completed_per_game_overall: z.string(),
  passes_completed_total_overall: z.string(),
  pass_completion_rate_percentile_overall: z.string(),
  passes_completed_per_90_overall: z.string(),
  passes_completed_per90_percentile_overall: z.string(),
  short_passes_per_game_overall: z.string(),
  long_passes_per_game_overall: z.string(),
  key_passes_per_game_overall: z.string(),
  key_passes_total_overall: z.string(),
  through_passes_per_game_overall: z.string(),
  crosses_per_game_overall: z.string(),
  tackles_per_90_overall: z.string(),
  tackles_per_game_overall: z.string(),
  tackles_total_overall: z.string(),
  tackles_successful_per_game_overall: z.string(),
  dispossesed_per_game_overall: z.string(),
  possession_regained_per_game_overall: z.string(),
  pressures_per_game_overall: z.string(),
  saves_per_game_overall: z.string(),
  interceptions_per_game_overall: z.string(),
  dribbles_successful_per_game_overall: z.string(),
  shots_faced_per_game_overall: z.string(),
  shots_per_goal_scored_overall: z.string(),
  shots_per_90_overall: z.string(),
  shots_off_target_per_game_overall: z.string(),
  dribbles_per_game_overall: z.string(),
  distance_travelled_per_game_overall: z.string(),
  shots_on_target_per_game_overall: z.string(),
  xg_per_game_overall: z.string(),
  chances_created_per_game_overall: z.string(),
  aerial_duels_won_per_game_overall: z.string(),
  aerial_duels_per_game_overall: z.string(),
  possession_regained_per_90_overall: z.string(),
  possession_regained_total_overall: z.string(),
  possession_regained_per90_percentile_overall: z.string(),
  additional_info: z.string(),
  shots_total_overall: z.string(),
  shots_per_game_overall: z.string(),
  shots_per90_percentile_overall: z.string(),
  shots_on_target_total_overall: z.string(),
  shots_on_target_per_90_overall: z.string(),
  shots_on_target_per90_percentile_overall: z.string(),
  shots_off_target_total_overall: z.string(),
  shots_off_target_per_90_overall: z.string(),
  shots_off_target_per90_percentile_overall: z.string(),
  games_subbed_out: z.string(),
  games_subbed_in: z.string(),
  games_started: z.string(),
  tackles_per90_percentile_overall: z.string(),
  tackles_successful_per_90_overall: z.string(),
  tackles_successful_per90_percentile_overall: z.string(),
  tackles_successful_total_overall: z.string(),
  interceptions_total_overall: z.string(),
  interceptions_per_90_overall: z.string(),
  interceptions_per90_percentile_overall: z.string(),
  crosses_total_overall: z.string(),
  cross_completion_rate_percentile_overall: z.string(),
  crosses_per_90_overall: z.string(),
  crosses_per90_percentile_overall: z.string(),
  through_passes_total_overall: z.string(),
  through_passes_per_90_overall: z.string(),
  through_passes_per90_percentile_overall: z.string(),
  long_passes_total_overall: z.string(),
  long_passes_per_90_overall: z.string(),
  long_passes_per90_percentile_overall: z.string(),
  short_passes_total_overall: z.string(),
  short_passes_per_90_overall: z.string(),
  short_passes_per90_percentile_overall: z.string(),
  key_passes_per_90_overall: z.string(),
  key_passes_per90_percentile_overall: z.string(),
  dribbles_total_overall: z.string(),
  dribbles_per_90_overall: z.string(),
  dribbles_per90_percentile_overall: z.string(),
  dribbles_successful_total_overall: z.string(),
  dribbles_successful_per_90_overall: z.string(),
  dribbles_successful_percentage_overall: z.string(),
  chances_created_total_overall: z.string(),
  chances_created_per_90_overall: z.string(),
  chances_created_per90_percentile_overall: z.string(),
  saves_total_overall: z.string(),
  save_percentage_percentile_overall: z.string(),
  saves_per_90_overall: z.string(),
  saves_per90_percentile_overall: z.string(),
  shots_faced_total_overall: z.string(),
  shots_per_goal_conceded_overall: z.string(),
  sm_goals_conceded_total_overall: z.string(),
  conceded_per90_percentile_overall: z.string(),
  shots_faced_per_90_overall: z.string(),
  shots_faced_per90_percentile_overall: z.string(),
  xg_faced_per_90_overall: z.string(),
  xg_faced_per90_percentile_overall: z.string(),
  xg_faced_per_game_overall: z.string(),
  xg_faced_total_overall: z.string(),
  save_percentage_overall: z.string(),
  pressures_total_overall: z.string(),
  pressures_per_90_overall: z.string(),
  pressures_per90_percentile_overall: z.string(),
  xg_total_overall: z.string(),
  market_value: z.string(),
  market_value_percentile: z.string(),
  pass_completion_rate_overall: z.string(),
  shot_accuraccy_percentage_overall: z.string(),
  shot_accuraccy_percentage_percentile_overall: z.string(),
  sm_goals_scored_total_overall: z.string(),
  dribbled_past_per90_percentile_overall: z.string(),
  dribbled_past_per_game_overall: z.string(),
  dribbled_past_per_90_overall: z.string(),
  dribbled_past_total_overall: z.string(),
  dribbles_successful_per90_percentile_overall: z.string(),
  dribbles_successful_percentage_percentile_overall: z.string(),
  pen_scored_total_overall: z.string(),
  pen_missed_total_overall: z.string(),
  inside_box_saves_total_overall: z.string(),
  blocks_per_game_overall: z.string(),
  blocks_per_90_overall: z.string(),
  blocks_total_overall: z.string(),
  blocks_per90_percentile_overall: z.string(),
  ratings_total_overall: z.string(),
  clearances_per_game_overall: z.string(),
  clearances_per_90_overall: z.string(),
  clearances_total_overall: z.string(),
  pen_committed_total_overall: z.string(),
  pen_save_percentage_overall: z.string(),
  pen_committed_per_90_overall: z.string(),
  pen_committed_per90_percentile_overall: z.string(),
  pen_committed_per_game_overall: z.string(),
  pens_saved_total_overall: z.string(),
  pens_taken_total_overall: z.string(),
  hit_woodwork_total_overall: z.string(),
  hit_woodwork_per_game_overall: z.string(),
  hit_woodwork_per_90_overall: z.string(),
  punches_total_overall: z.string(),
  punches_per_game_overall: z.string(),
  punches_per_90_overall: z.string(),
  offsides_per_90_overall: z.string(),
  offsides_per_game_overall: z.string(),
  offsides_total_overall: z.string(),
  penalties_won_total_overall: z.string(),
  shot_conversion_rate_overall: z.string(),
  shot_conversion_rate_percentile_overall: z.string(),
  sm_minutes_played_per90_percentile_overall: z.string(),
  sm_minutes_played_recorded_overall: z.string(),
  minutes_played_percentile_overall: z.string(),
  matches_played_percentile_overall: z.string(),
  min_per_goal_percentile_overall: z.string(),
  min_per_conceded_percentile_overall: z.string(),
  xa_total_overall: z.string(),
  xa_per90_percentile_overall: z.string(),
  xa_per_game_overall: z.string(),
  xa_per_90_overall: z.string(),
  npxg_total_overall: z.string(),
  npxg_per90_percentile_overall: z.string(),
  npxg_per_game_overall: z.string(),
  npxg_per_90_overall: z.string(),
  fouls_drawn_per90_percentile_overall: z.string(),
  fouls_drawn_total_overall: z.string(),
  fouls_drawn_per_game_overall: z.string(),
  fouls_drawn_per_90_overall: z.string(),
  fouls_committed_per_90_overall: z.string(),
  fouls_committed_per_game_overall: z.string(),
  fouls_committed_per90_percentile_overall: z.string(),
  fouls_committed_total_overall: z.string(),
  xg_per_90_overall: z.string(),
  xg_per90_percentile_overall: z.string(),
  average_rating_percentile_overall: z.string(),
  clearances_per90_percentile_overall: z.string(),
  hit_woodwork_per90_percentile_overall: z.string(),
  punches_per90_percentile_overall: z.string(),
  offsides_per90_percentile_overall: z.string(),
  aerial_duels_won_per90_percentile_overall: z.string(),
  aerial_duels_total_overall: z.string(),
  aerial_duels_per_90_overall: z.string(),
  aerial_duels_per90_percentile_overall: z.string(),
  aerial_duels_won_total_overall: z.string(),
  aerial_duels_won_percentage_overall: z.string(),
  aerial_duels_won_per_90_overall: z.string(),
  duels_per_90_overall: z.string(),
  duels_per_game_overall: z.string(),
  duels_total_overall: z.string(),
  duels_won_total_overall: z.string(),
  duels_won_per90_percentile_overall: z.string(),
  duels_per90_percentile_overall: z.string(),
  duels_won_per_90_overall: z.string(),
  duels_won_per_game_overall: z.string(),
  duels_won_percentage_overall: z.string(),
  dispossesed_total_overall: z.string(),
  dispossesed_per_90_overall: z.string(),
  dispossesed_per90_percentile_overall: z.string(),
  progressive_passes_total_overall: z.string(),
  cross_completion_rate_overall: z.string(),
  distance_travelled_total_overall: z.string(),
  distance_travelled_per_90_overall: z.string(),
  distance_travelled_per90_percentile_overall: z.string(),
  accurate_crosses_total_overall: z.string(),
  accurate_crosses_per_game_overall: z.string(),
  accurate_crosses_per_90_overall: z.string(),
  accurate_crosses_per90_percentile_overall: z.string(),
  sm_matches_recorded_total_overall: z.string(),
  games_started_percentile_overall: z.string(),
  games_subbed_in_percentile_overall: z.string(),
  games_subbed_out_percentile_overall: z.string(),
  hattricks_total_overall: z.string(),
  two_goals_in_a_game_total_overall: z.string(),
  three_goals_in_a_game_total_overall: z.string(),
  two_goals_in_a_game_percentage_overall: z.string(),
  three_goals_in_a_game_percentage_overall: z.string(),
  goals_involved_per90_percentile_overall: z.string(),
  goals_per90_percentile_overall: z.string(),
  goals_per90_percentile_away: z.string(),
  goals_per90_percentile_home: z.string(),
  man_of_the_match_total_overall: z.string(),
  annual_salary_eur: z.string(),
  annual_salary_eur_percentile: z.string(),
  clean_sheets_percentage_percentile_overall: z.string(),
  min_per_card_percentile_overall: z.string(),
  cards_per90_percentile_overall: z.string(),
  booked_over05_overall: z.string(),
  booked_over05_percentage_overall: z.string(),
  booked_over05_percentage_percentile_overall: z.string(),
  shirt_number: z.string(),
  annual_salary_gbp: z.string(),
  annual_salary_usd: z.string(),
});

const gameSchema = z.object({
  timestamp: z.number(),
  date_GMT: z.string(),
  status: z.string(),
  attendance: z.number(),
  home_team_name: z.string(),
  away_team_name: z.string(),
  referee: z.string(),
  "Game Week": z.number(),
  "Pre-Match PPG (Home)": z.number(),
  "Pre-Match PPG (Away)": z.number(),
  home_ppg: z.number(),
  away_ppg: z.number(),
  home_team_goal_count: z.number(),
  away_team_goal_count: z.number(),
  total_goal_count: z.number(),
  total_goals_at_half_time: z.number(),
  home_team_goal_count_half_time: z.number(),
  away_team_goal_count_half_time: z.number(),
  home_team_goal_timings: z
    .union([z.string(), z.number()])
    .transform((timings) => {
      return timings.toString();
    }),
  away_team_goal_timings: z
    .union([z.string(), z.number()])
    .transform((timings) => {
      return timings.toString();
    }),
  home_team_corner_count: z.number(),
  away_team_corner_count: z.number(),
  home_team_yellow_cards: z.number(),
  home_team_red_cards: z.number(),
  away_team_yellow_cards: z.number(),
  away_team_red_cards: z.number(),
  home_team_first_half_cards: z.number(),
  home_team_second_half_cards: z.number(),
  away_team_first_half_cards: z.number(),
  away_team_second_half_cards: z.number(),
  home_team_shots: z.number(),
  away_team_shots: z.number(),
  home_team_shots_on_target: z.number(),
  away_team_shots_on_target: z.number(),
  home_team_shots_off_target: z.number(),
  away_team_shots_off_target: z.number(),
  home_team_fouls: z.number(),
  away_team_fouls: z.number(),
  home_team_possession: z.number(),
  away_team_possession: z.number(),
  "Home Team Pre-Match xG": z.number(),
  "Away Team Pre-Match xG": z.number(),
  team_a_xg: z.number(),
  team_b_xg: z.number(),
  average_goals_per_match_pre_match: z.number(),
  btts_percentage_pre_match: z.number(),
  over_15_percentage_pre_match: z.number(),
  over_25_percentage_pre_match: z.number(),
  over_35_percentage_pre_match: z.number(),
  over_45_percentage_pre_match: z.number(),
  over_15_HT_FHG_percentage_pre_match: z.number(),
  over_05_HT_FHG_percentage_pre_match: z.number(),
  over_15_2HG_percentage_pre_match: z.number(),
  over_05_2HG_percentage_pre_match: z.number(),
  average_corners_per_match_pre_match: z.number(),
  average_cards_per_match_pre_match: z.number(),
  odds_ft_home_team_win: z.number(),
  odds_ft_draw: z.number(),
  odds_ft_away_team_win: z.number(),
  odds_ft_over15: z.number(),
  odds_ft_over25: z.number(),
  odds_ft_over35: z.number(),
  odds_ft_over45: z.number(),
  odds_btts_yes: z.number(),
  odds_btts_no: z.number(),
  stadium_name: z.string(),
});

const preSeedCountries = async () => {
  await prisma.country.createMany({
    data: [
      {
        name: "Croatia",
      },
      {
        name: "England",
      },
    ],
  });
};

const getOrCreateCountry = async (countryName: string) => {
  const countryId = (
    await prisma.country.findUnique({
      where: { name: countryName },
      select: { id: true },
    })
  )?.id;

  if (!countryId) {
    return (
      await prisma.country.create({
        data: {
          name: countryName,
        },
      })
    ).id;
  }

  return countryId;
};

const getOrCreateTeam = async ({
  teamName,
  countryId,
}: {
  teamName: string;
  countryId: string;
}) => {
  const possibleTeam = await prisma.team.findFirst({
    where: { name: teamName },
  });
  if (!possibleTeam) {
    const team = await prisma.team.create({
      data: {
        name: teamName,
        countryId,
      },
    });
    return team.id;
  }
  return possibleTeam.id;
};

const getPosition = (postition: string): Position => {
  if (postition === "Defender") {
    return Position.CENTRE_BACK;
  }
  if (postition === "Midfielder") {
    return Position.CENTER_MIDFIELDER;
  }
  if (postition === "Forward") {
    return Position.CENTER_FORWARD;
  }
  return Position.CENTER_FORWARD;
};

const addTeamToSeasonAncCompetition = async ({
  team,
  season,
  competition,
}: {
  team: string;
  competition: string;
  season: string;
}) => {
  const exists = await prisma.teamInCompetition
    .count({
      where: {
        competitionId: competition,
        seasonId: season,
        teamId: team,
      },
    })
    .then((count) => count > 0);
  if (exists) {
    return;
  }

  await prisma.teamInCompetition.create({
    data: {
      competitionId: competition,
      seasonId: season,
      teamId: team,
    },
  });
};

const addPlayerToTeamInSeason = async (playerInTeam: {
  playerId: string;
  teamId: string;
  seasonId: string;
}) => {
  const previousClubInSeason = await prisma.playersTeamInSeason.findUnique({
    where: {
      teamId_playerId_seasonId: playerInTeam,
    },
    select: {
      id: true,
    },
  });

  if (!previousClubInSeason) {
    await prisma.playersTeamInSeason.createMany({
      data: playerInTeam,
    });
  }
};

const getOrCreatePlayer = async ({
  firstName,
  lastName,
  dateOfBirth,
  countryId,
  primaryPosition,
  primaryShirtNumber,
  team: { seasonId, teamId, isCurrentSeasson },
}: {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  countryId: string;
  primaryPosition: Position;
  primaryShirtNumber: string | undefined;
  team: {
    seasonId: string;
    teamId: string;
    isCurrentSeasson: boolean;
  };
}) => {
  const possiblePlayer = await prisma.player.findFirst({
    where: {
      firstName,
      lastName,
      dateOfBirth,
      countryId,
    },
    select: {
      id: true,
    },
  });

  if (possiblePlayer) {
    addPlayerToTeamInSeason({ teamId, seasonId, playerId: possiblePlayer.id });
    return possiblePlayer.id;
  }

  try {
    const player = await prisma.player.create({
      data: {
        firstName,
        lastName,
        ...(isCurrentSeasson ? { teamId } : {}),
        ...(primaryShirtNumber && primaryShirtNumber !== "N/A"
          ? {
            primaryShirtNumber: +primaryShirtNumber,
          }
          : {}),
        countryId: countryId,
        primaryPosition,
        dateOfBirth,
      },
    });

    addPlayerToTeamInSeason({ teamId, seasonId, playerId: player.id });
    return player.id;
  } catch (e) {
    console.error("Error ingesting player", e);
  }
};

const addPlPlayers1819 = async ({
  fileLocation,
  season,
  competition,
  isCurrentSeasson,
  countryId: teamCountryId,
}: {
  competition: string;
  season: string;
  fileLocation: PathOrFileDescriptor;
  isCurrentSeasson: boolean;
  countryId: string;
}) => {
  const playersJson = JSON.parse(
    readFileSync(fileLocation).toString()
  ) as any[];

  let counter = 0;

  for (let playerRaw of playersJson) {
    const playerValidated = playersSchema.parse(playerRaw);

    console.log(`Player ${counter++}: ${playerValidated.full_name}`);

    const currentTeam = await getOrCreateTeam({
      countryId: teamCountryId,
      teamName: playerValidated["Current Club"],
    });

    addTeamToSeasonAncCompetition({ competition, season, team: currentTeam });

    const countryId = await getOrCreateCountry(playerValidated.nationality);

    const player = await getOrCreatePlayer({
      firstName: playerValidated.full_name.split(" ")[0],
      lastName: playerValidated.full_name.substring(
        playerValidated.full_name.indexOf(" ") + 1,
        playerValidated.full_name.length
      ),
      primaryShirtNumber: playerValidated.shirt_number,
      countryId: countryId,
      primaryPosition: getPosition(playerValidated.position),
      dateOfBirth: new Date(playerValidated.birthday_GMT),
      team: {
        seasonId: season,
        teamId: currentTeam,
        isCurrentSeasson,
      },
    });
  }
};

const createOrGetCompetition = async ({
  competitionName,
  countryId,
  type,
}: {
  competitionName: string;
  countryId: string;
  type: CompetitionType;
}): Promise<string> => {
  const possibleCompetitionId = await prisma.competition
    .findFirst({ where: { name: competitionName, countryId: countryId } })
    .then((comp) => comp?.id);
  if (!possibleCompetitionId) {
    return await prisma.competition
      .create({
        data: {
          countryId,
          name: competitionName,
          isHighlighted: false,
          type,
        },
      })
      .then((comp) => comp.id);
  }
  return possibleCompetitionId;
};

const getRandomSubarray = <T>(arr: T[], size: number) => {
  var shuffled = arr.slice(0),
    i = arr.length,
    temp,
    index;
  while (i--) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(0, size);
};

const generateRandomGoals = async ({
  seasonId,
  teamId,
  gameId,
  goalCount,
  goalTimings,
  isHomeTeamGoal
}: {
  teamId: string;
  seasonId: string;
  gameId: string;
  goalCount: number;
  goalTimings: string;
  isHomeTeamGoal: boolean;
}) => {
  if (goalCount === 0) return;

  const itemCount = await prisma.playersTeamInSeason.count({
    where: { seasonId, teamId },
  });
  const skip = Math.max(0, Math.floor(Math.random() * itemCount) - goalCount);
  const orderBy = getRandomSubarray(['id', 'seasonId', 'teamId'], 1)[0];
  const orderDir = getRandomSubarray(['asc', 'desc'], 1)[0];

  const players = await prisma.playersTeamInSeason.findMany({
    take: goalCount,
    skip,
    where: { seasonId, teamId },
    orderBy: { [orderBy]: orderDir },
    select: { playerId: true },
  });

  const timings = goalTimings.split(",");
  for (let player of players) {
    const timing = timings.pop();

    if (!timing) {
      break;
    }

    const isInExtratime = timing.includes("'");

    const minute = +timing.split("'")[0];
    let extraMinute = undefined;
    if (isInExtratime) {
      extraMinute = +timing.split("'")[1];
    }

    const halftime = minute <= 45 ? Halftime.FIRST_HALF : Halftime.SECOND_HALF;

    const createdGoal = await prisma.goal.create({
      data: {
        isOwnGoal: false,
        scorerId: player.playerId,
        isPenalty: Math.floor(Math.random() * 2) === 1,
        isPenaltyInShootout: false,
        scoredInMinute: minute,
        ...(isInExtratime && extraMinute
          ? { scoredInExtraMinute: extraMinute }
          : {}),
        scoredInHalftime: halftime,
        gameId,
        isHomeTeamGoal
      },
    });
    console.log("Created goal", createdGoal.id);
  }
};

const addGames = async ({
  competitionId,
  seasonId,
  filePath,
  countryId,
}: {
  filePath: PathOrFileDescriptor;
  seasonId: string;
  competitionId: string;
  countryId: string;
}) => {
  const games = gameSchema
    .array()
    .parse(JSON.parse(readFileSync(filePath).toString()));

  let counter = 0;
  for (let game of games) {
    console.log(
      `Game ${counter++}: ${game.home_team_name} vs ${game.away_team_name}`
    );

    const [homeTeamId, awayTeamId] = await Promise.all([
      getOrCreateTeam({ teamName: game.home_team_name, countryId }),
      getOrCreateTeam({ teamName: game.away_team_name, countryId }),
    ]);

    const { id } = await prisma.game.create({
      data: {
        seasonId,
        competitionId,
        homeTeamId,
        awayTeamId,
        kickoffTime: new Date(game.timestamp * 1000),

        // TODO: prema krajnjojo minuti gola zadnjeg odrediti ako ima dodatnog vremena?
        firstHalfEndedAferAdditionalTime: 0,
        secondHalfEndedAferAdditionalTime: 0,
        hasExtraTime: false,

        isOver: game.status === "complete",
        hasPenaltyShootout: false,
      },
    });

    await Promise.all([
      generateRandomGoals({
        gameId: id,
        goalCount: game.home_team_goal_count,
        goalTimings: game.home_team_goal_timings,
        teamId: homeTeamId,
        seasonId,
        isHomeTeamGoal: true
      }),
      generateRandomGoals({
        gameId: id,
        goalCount: game.away_team_goal_count,
        goalTimings: game.away_team_goal_timings,
        teamId: awayTeamId,
        seasonId,
        isHomeTeamGoal: false
      }),
    ]);
  }
};

const createOrGetSeason = async ({
  seasonId,
  isCurrentSeasson,
}: {
  seasonId: string;
  isCurrentSeasson: boolean;
}): Promise<string> => {
  const possibleSeasonId = await prisma.season
    .findUnique({ where: { title: seasonId }, select: { id: true } })
    .then((s) => s?.id);
  if (!possibleSeasonId) {
    return await prisma.season
      .create({
        data: {
          title: seasonId,
          isCurrent: isCurrentSeasson,
        },
      })
      .then((season) => season.id);
  }
  return possibleSeasonId;
};

const addSeasonToCompetition = async ({
  seasonId,
  competitionId,
}: {
  seasonId: string;
  competitionId: string;
}) => {
  await prisma.competitionInSeason.create({
    data: {
      seasonId,
      competitionId,
    },
  });
};

const createPL1819 = async (england: string) => {
  const premierLeague = await createOrGetCompetition({
    countryId: england,
    competitionName: "Premier League",
    type: CompetitionType.LEAGUE,
  });
  const season1819 = await createOrGetSeason({
    seasonId: "2018/19",
    isCurrentSeasson: false,
  });
  addSeasonToCompetition({
    competitionId: premierLeague,
    seasonId: season1819,
  });

  return { competition: premierLeague, season: season1819 };
};

const seed = async () => {
  await preSeedCountries();

  const england = await getOrCreateCountry("England");
  const pl1819 = await createPL1819(england);

  await addPlPlayers1819({
    ...pl1819,
    fileLocation: "./prisma/data/players.json",
    isCurrentSeasson: false,
    countryId: england,
  });

  await addGames({
    countryId: england,
    competitionId: pl1819.competition,
    filePath: "./prisma/data/games-pl-1819.json",
    seasonId: pl1819.season,
  });
};

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
