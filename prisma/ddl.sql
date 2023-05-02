create type "Halftime" as enum ('FIRST_HALF', 'SECOND_HALF', 'EXTRA_FIRST_HALF', 'EXTRA_SECOND_HALF');

create type "CardType" as enum ('RED', 'YELLOW', 'SECOND_YELLOW');

create type "Position" as enum ('GOAL_KEEPER', 'CENTRE_BACK', 'LEFT_BACK', 'RIGHT_BACK', 'LEFT_WING_BACK', 'RIGHT_WING_BACK', 'CENTER_DEFNSIVE_MIDFIELDER', 'CENTER_MIDFIELDER', 'RIGHT_MIDFIELDER', 'LEFT_MIDFIELDER', 'CENTER_ATTACKING_MIDFIELDER', 'RIGHT_WINGER', 'LEFT_WINGER', 'CENTER_FORWARD', 'SUBSTITUTE');

create type "UserRole" as enum ('USER', 'ADMIN');

create type "CompetitionType" as enum ('LEAGUE', 'GROUP_STAGE_AND_KNOCKOUTS', 'TOURNAMENT');

create type "GameStatus" as enum ('NOT_STARTED', 'STARTED', 'HALFTIME', 'OVER');

create table if not exists "User"
(
    id          text       not null
        primary key,
    "firstName" text       not null,
    "lastName"  text       not null,
    email       text       not null,
    role        "UserRole" not null
);

create table if not exists "Manager"
(
    id          text not null
        primary key,
    "firstName" text not null,
    "lastName"  text not null,
    "teamId"    text,
    "imageSlug" text,
    unique ("teamId")
);

create table if not exists "Season"
(
    id          text    not null
        primary key,
    title       text    not null,
    "isCurrent" boolean not null,
    unique (title)
);

create table if not exists "Country"
(
    id          text not null
        primary key,
    name        text not null,
    "imageSlug" text,
    unique (name)
);

create table if not exists "Player"
(
    id                   text         not null
        primary key,
    "firstName"          text         not null,
    "lastName"           text         not null,
    "primaryShirtNumber" integer,
    "primaryPosition"    "Position"   not null,
    "dateOfBirth"        timestamp(3) not null,
    "imageSlug"          text,
    "countryId"          text         not null
        references "Country"
            on update cascade on delete restrict,
    "teamId"             text
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

create table if not exists "Team"
(
    id                  text not null
        primary key,
    name                text not null,
    "countryId"         text not null
        references "Country"
            on update cascade on delete restrict,
    "imageSlug"         text,
    "groupId"           text,
    "primaryShirtColor" text not null
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

create table if not exists "PlayersTeamInSeason"
(
    id         text not null
        primary key,
    "teamId"   text not null
        references "Team"
            on update cascade on delete restrict,
    "playerId" text not null
        references "Player"
            on update cascade on delete restrict,
    "seasonId" text not null
        references "Season"
            on update cascade on delete restrict,
    unique ("teamId", "playerId", "seasonId")
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
            on update cascade on delete restrict,
    "seasonId"      text not null
        references "Season"
            on update cascade on delete restrict
);

create table if not exists "HighlightedTeam"
(
    id       text not null
        primary key,
    "teamId" text not null
        references "Team"
            on update cascade on delete restrict
);

create table if not exists "Game"
(
    id                                  text                                                   not null
        primary key,
    "competitionId"                     text                                                   not null
        references "Competition"
            on update cascade on delete restrict,
    "homeTeamId"                        text                                                   not null
        references "Team"
            on update cascade on delete restrict,
    "awayTeamId"                        text                                                   not null
        references "Team"
            on update cascade on delete restrict,
    "gameStatisticsId"                  text,
    "kickoffTime"                       timestamp(3)                                           not null,
    "firstHalfEndedAferAdditionalTime"  integer                                                not null,
    "secondHalfEndedAferAdditionalTime" integer                                                not null,
    "seasonId"                          text
                                                                                               references "Season"
                                                                                                   on update cascade on delete set null,
    "homeTeamShirtColor"                text                                                   not null,
    "homeTeamGoalkeeperShirtColor"      text                                                   not null,
    "awayTeamShirtColor"                text                                                   not null,
    "awayTeamGoalkeeperShirtColor"      text                                                   not null,
    "homeTeamLineup"                    jsonb                                                  not null,
    "awayTeamLineup"                    jsonb                                                  not null,
    status                              "GameStatus" default 'OVER'::"GameStatus"              not null,
    "awayTeamManagerId"                 text         default 'clh6fsxgu0000uvimeozrkg1m'::text not null
        references "Manager"
            on update cascade on delete restrict,
    "homeTeamManagerId"                 text         default 'clh6fsxgu0000uvimeozrkg1m'::text not null
        references "Manager"
            on update cascade on delete restrict
);

create table if not exists "Goal"
(
    id                    text    not null
        primary key,
    "scorerId"            text    not null
        references "Player"
            on update cascade on delete restrict,
    "isOwnGoal"           boolean not null,
    "isPenalty"           boolean not null,
    "scoredInMinute"      integer not null,
    "scoredInExtraMinute" integer,
    "isHomeTeamGoal"      boolean not null,
    "assistentId"         text
                                  references "Player"
                                      on update cascade on delete set null,
    "gameId"              text    not null
        references "Game"
            on update cascade on delete restrict
);

create table if not exists "GameStatistics"
(
    id                         text    not null
        primary key,
    "homeTeamBallPossession"   integer not null,
    "gameId"                   text    not null
        references "Game"
            on update cascade on delete restrict,
    "homeTeamTotalShots"       integer not null,
    "homeTeamShotsOnTarget"    integer not null,
    "homeTeamCornerKicks"      integer not null,
    "homeTeamOffsides"         integer not null,
    "homeTeamFouls"            integer not null,
    "homeTeamBigChances"       integer not null,
    "homeTeamPasses"           integer not null,
    "homeTeamCrosses"          integer not null,
    "homeTeamTackles"          integer not null,
    "homeTeamDribles"          integer not null,
    "homeTeamDriblesSucessful" integer not null,
    "awayTeamBallPossession"   integer not null,
    "awayTeamTotalShots"       integer not null,
    "awayTeamShotsOnTarget"    integer not null,
    "awayTeamCornerKicks"      integer not null,
    "awayTeamOffsides"         integer not null,
    "awayTeamFouls"            integer not null,
    "awayTeamBigChances"       integer not null,
    "awayTeamPasses"           integer not null,
    "awayTeamCrosses"          integer not null,
    "awayTeamTackles"          integer not null,
    "awayTeamDribles"          integer not null,
    "awayTeamDriblesSucessful" integer not null,
    unique ("gameId")
);

create table if not exists "CardAwarded"
(
    id                text       not null
        primary key,
    "cardType"        "CardType" not null,
    "playerId"        text       not null
        references "Player"
            on update cascade on delete restrict,
    "gameId"          text       not null
        references "Game"
            on update cascade on delete restrict,
    minute            integer    not null,
    "extraTimeMinute" integer,
    "isHomeTeam"      boolean    not null
);

create table if not exists "Substitution"
(
    id                text    not null
        primary key,
    minute            integer not null,
    "extraTimeMinute" integer,
    "playerInId"      text    not null
        references "Player"
            on update cascade on delete restrict,
    "playerOutId"     text    not null
        references "Player"
            on update cascade on delete restrict,
    "gameId"          text    not null
        references "Game"
            on update cascade on delete restrict,
    "isHomeTeam"      boolean not null
);

create table if not exists "ManagerInTeamSeason"
(
    id          text not null
        primary key,
    "teamId"    text not null
        references "Team"
            on update cascade on delete restrict,
    "seasonId"  text not null
        references "Season"
            on update cascade on delete restrict,
    "managerId" text not null
        references "Manager"
            on update cascade on delete restrict
);
