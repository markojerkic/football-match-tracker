import { Position, PrismaClient } from "@prisma/client";
import { z } from "zod";
import { readFileSync } from "fs";

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

const seedCountries = async () => {
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

const getOrCreateTeam = async (teamName: string, countryName: string) => {
  const countryId = await prisma.country.findUniqueOrThrow({
    where: { name: countryName },
    select: { id: true },
  });
  const possibleTeam = await prisma.team.findFirst({
    where: { name: teamName },
  });
  if (!possibleTeam) {
    const team = await prisma.team.create({
      data: {
        name: teamName,
        countryId: countryId.id,
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

const seedPlayers = async () => {
  const playersJson = JSON.parse(
    readFileSync("./prisma/data/players.json").toString()
  ) as any[];

  let counter = 0;
  const players = [];
  for (let playerRaw of playersJson) {
    const playerValidated = playersSchema.parse(playerRaw);

    console.log(`Player ${counter++}: ${playerValidated.full_name}`);

    const currentTeam = await getOrCreateTeam(
      playerValidated["Current Club"],
      "England"
    );
    const countryId = await getOrCreateCountry(playerValidated.nationality);

    players.push({
      firstName: playerValidated.full_name.split(" ")[0],
      lastName: playerValidated.full_name.substring(
        playerValidated.full_name.indexOf(" ") + 1,
        playerValidated.full_name.length
      ),
      teamId: currentTeam,
      ...(playerValidated.shirt_number !== "N/A"
        ? {
            primaryShirtNumber: +playerValidated.shirt_number,
          }
        : {}),
      countryId: countryId,
      primaryPosition: getPosition(playerValidated.position),
      dateOfBirth: new Date(playerValidated.birthday_GMT),
    });
  }

  try {
    await prisma.player.createMany({
      data: players,
    });
  } catch (e) {
    console.error(e);
  }
};

const seed = async () => {
  try {
    await seedCountries();
  } catch (e) {
    console.error(e);
  }
  await seedPlayers();
  console.log("seed");
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
