create type "Halftime" as enum ('FIRST_HALF', 'SECOND_HALF', 'EXTRA_FIRST_HALF', 'EXTRA_SECOND_HALF');

create type "CardType" as enum ('RED', 'YELLOW');

create type "Position" as enum ('GOAL_KEEPER', 'CENTRE_BACK', 'LEFT_BACK', 'RIGHT_BACK', 'LEFT_WING_BACK', 'RIGHT_WING_BACK', 'CENTER_DEFNSIVE_MIDFIELDER', 'CENTER_MIDFIELDER', 'RIGHT_MIDFIELDER', 'LEFT_MIDFIELDER', 'CENTER_ATTACKING_MIDFIELDER', 'RIGHT_WINGER', 'LEFT_WINGER', 'CENTER_FORWARD', 'SUBSTITUTE');

create type "UserRole" as enum ('USER', 'ADMIN');

create type "CompetitionType" as enum ('LEAGUE', 'GROUP_STAGE_AND_KNOCKOUTS', 'TOURNAMENT');

create table if not exists "User"
(
    id          text       not null
        primary key,
    "firstName" text       not null,
    "lastName"  text       not null,
    email       text       not null,
    role        "UserRole" not null,
    "imageSlug" text
);


create table if not exists "Season"
(
    id    text not null
        primary key,
    title text not null
);


create table if not exists "Country"
(
    id          text not null
        primary key,
    code        text not null,
    name        text not null,
    "imageSlug" text,
    unique ("code"),
    unique ("name")
);


create table if not exists "Competition"
(
    id              text              not null
        primary key,
    name            text              not null,
    "countryId"     text              not null
        references "Country"
            on update cascade on delete restrict,
    "isHighlighted" boolean           not null,
    "imageSlug"     text,
    type            "CompetitionType" not null
);


create table if not exists "CompetitionInSeason"
(
    id              text not null
        primary key,
    "competitionId" text not null
        references "Competition"
            on update cascade on delete restrict,
    "seasonId"      text not null
        references "Season"
            on update cascade on delete restrict
);


create table if not exists "Group"
(
    id              text not null
        primary key,
    name            text not null,
    "competitionId" text not null
        references "Competition"
            on update cascade on delete restrict,
    "seasonId"      text not null
        references "Season"
            on update cascade on delete restrict
);

create table if not exists "Team"
(
    id          text not null
        primary key,
    name        text not null,
    "countryId" text not null
        references "Country"
            on update cascade on delete restrict,
    "imageSlug" text,
    "groupId"   text
);


create table if not exists "FavouriteTeam"
(
    id       text not null
        primary key,
    "userId" text not null
        references "User"
            on update cascade on delete restrict,
    "teamId" text not null
        references "Team"
            on update cascade on delete restrict
);


create table if not exists "Manager"
(
    id          text not null
        primary key,
    "firstName" text not null,
    "lastName"  text not null,
    "teamId"    text
                     references "Team"
                         on update cascade on delete set null,
    unique ("teamId")
);


create table if not exists "PreviousManager"
(
    id            text         not null
        primary key,
    "managerId"   text         not null
        references "Manager"
            on update cascade on delete restrict,
    "teamId"      text         not null
        references "Team"
            on update cascade on delete restrict,
    "tenureStart" timestamp(3) not null,
    "tenureEnd"   timestamp(3)
);


create table if not exists "Player"
(
    id                   text         not null
        primary key,
    "firstName"          text         not null,
    "lastName"           text         not null,
    "primaryShirtNumber" integer      not null,
    "primaryPosition"    "Position"   not null,
    "dateOfBirth"        timestamp(3) not null,
    "imageSlug"          text,
    "countryId"          text         not null
        references "Country"
            on update cascade on delete restrict,
    "teamId"             text
                                      references "Team"
                                          on update cascade on delete set null
);


create table if not exists "FavouritePlayer"
(
    id         text not null
        primary key,
    "userId"   text not null
        references "User"
            on update cascade on delete restrict,
    "playerId" text not null
        references "Player"
            on update cascade on delete restrict
);


create table if not exists "PreviousTeam"
(
    id            text         not null
        primary key,
    "teamId"      text         not null
        references "Team"
            on update cascade on delete restrict,
    "playerId"    text         not null
        references "Player"
            on update cascade on delete restrict,
    "tenureStart" timestamp(3) not null,
    "tenureEnd"   timestamp(3)
);


create table if not exists "TeamInCompetition"
(
    id              text not null
        primary key,
    "teamId"        text not null
        references "Team"
            on update cascade on delete restrict,
    "competitionId" text not null
        references "Competition"
            on update cascade on delete restrict
);


create table if not exists "TeamInGroup"
(
    id        text not null
        primary key,
    "groupId" text not null
        references "Group"
            on update cascade on delete restrict,
    "teamId"  text not null
        references "Team"
            on update cascade on delete restrict
);


create table if not exists "HighlightedTeam"
(
    id       text not null
        primary key,
    "teamId" text not null
        references "Team"
            on update cascade on delete restrict,
);


create table if not exists "PlayerInGameLineup"
(
    id                  text            not null
        primary key,
    "playerId"          text            not null
        references "Player"
            on update cascade on delete restrict,
    "gamePosition"      "Position",
    "shirtNumber"       integer,
    "subbedInMinute"    numeric(65, 30) not null,
    "subbedInHalftime"  "Halftime"      not null,
    "subbedOutMinute"   numeric(65, 30),
    "subbedOutHalftime" "Halftime",
    "startedGame"       boolean         not null
);


create table if not exists "Game"
(
    id                                          text         not null
        primary key,
    "competitionId"                             text         not null
        references "Competition"
            on update cascade on delete restrict,
    "homeTeamId"                                text         not null
        references "Team"
            on update cascade on delete restrict,
    "awayTeamId"                                text         not null
        references "Team"
            on update cascade on delete restrict,
    "gameStatisticsId"                          text,
    "kickoffTime"                               timestamp(3) not null,
    "firstHalfEndedAferAdditionalTime"          integer      not null,
    "secondHalfEndedAferAdditionalTime"         integer      not null,
    "isOver"                                    boolean      not null,
    "hasExtraTime"                              boolean      not null,
    "firstExtendedHalfEndedAferAdditionalTime"  integer,
    "secondExtendedHalfEndedAferAdditionalTime" integer,
    "hasPenaltyShootout"                        boolean      not null,
    "seasonId"                                  text
                                                             references "Season"
                                                                 on update cascade on delete set null
);


create table if not exists "KnockoutGame"
(
    id             text not null
        primary key,
    "gameId"       text not null
        references "Game"
            on update cascade on delete restrict,
    "returnGameId" text
                        references "Game"
                            on update cascade on delete set null,
    unique ("gameId"),
    unique ("returnGameId")
);

create table if not exists "Goal"
(
    id                    text       not null
        primary key,
    "scorerId"            text       not null
        references "Player"
            on update cascade on delete restrict,
    "isOwnGoal"           boolean    not null,
    "isPenalty"           boolean    not null,
    "isPenaltyInShootout" boolean    not null,
    "scoredInMinute"      integer    not null,
    "scoredInHalftime"    "Halftime" not null,
    "assistentId"         text
                                     references "Player"
                                         on update cascade on delete set null
);


create table if not exists "GoalInGame"
(
    id       text not null
        primary key,
    "gameId" text not null
        references "Game"
            on update cascade on delete restrict,
    "goalId" text not null
        references "Goal"
            on update cascade on delete restrict
);


create table if not exists "GameStatistics"
(
    id                         text             not null
        primary key,
    "homeTeamBallPossession"   double precision not null,
    "gameId"                   text             not null
        references "Game"
            on update cascade on delete restrict,
    "homeTeamTotalShots"       integer          not null,
    "homeTeamShotsOnTarget"    integer          not null,
    "homeTeamCornerKicks"      integer          not null,
    "homeTeamOffsides"         integer          not null,
    "homeTeamFouls"            integer          not null,
    "homeTeamBigChances"       integer          not null,
    "homeTeamPasses"           integer          not null,
    "homeTeamCrosses"          integer          not null,
    "homeTeamTackles"          integer          not null,
    "homeTeamDribbles"         integer          not null,
    homeTeamDribblesSuccessful integer          not null,
    "awayTeamTotalShots"       integer          not null,
    "awayTeamShotsOnTarget"    integer          not null,
    "awayTeamCornerKicks"      integer          not null,
    "awayTeamOffsides"         integer          not null,
    "awayTeamFouls"            integer          not null,
    "awayTeamBigChances"       integer          not null,
    awayTeamPasses             integer          not null,
    awayTeamCrosses            integer          not null,
    awayTeamTackles            integer          not null,
    awayTeamDribbles           integer          not null,
    awayTerriblesSuccessful    integer          not null,
    unique ("gameId")
);


create table if not exists "CardAwarded"
(
    id         text            not null
        primary key,
    "cardType" "CardType"      not null,
    "playerId" text            not null
        references "Player"
            on update cascade on delete restrict,
    "gameId"   text            not null
        references "Game"
            on update cascade on delete restrict,
    minute     numeric(65, 30) not null,
    halftime   "Halftime"      not null
);
