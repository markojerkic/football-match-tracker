create type "Halftime" as enum ('FIRST_HALF', 'SECOND_HALF', 'EXTRA_FIRST_HALF', 'EXTRA_SECOND_HALF');

alter type "Halftime" owner to db;

create type "CardType" as enum ('RED', 'YELLOW');

alter type "CardType" owner to db;

create type "Position" as enum ('GOAL_KEEPER', 'CENTRE_BACK', 'LEFT_BACK', 'RIGHT_BACK', 'LEFT_WING_BACK', 'RIGHT_WING_BACK', 'CENTER_DEFNSIVE_MIDFIELDER', 'CENTER_MIDFIELDER', 'RIGHT_MIDFIELDER', 'LEFT_MIDFIELDER', 'CENTER_ATTACKING_MIDFIELDER', 'RIGHT_WINGER', 'LEFT_WINGER', 'CENTER_FORWARD', 'SUBSTITUTE');

alter type "Position" owner to db;

create type "UserRole" as enum ('USER', 'ADMIN');

alter type "UserRole" owner to db;

create table "Country"
(
    id          text not null
        primary key,
    code        text not null,
    name        text not null,
    "imageSlug" text
);

alter table "Country"
    owner to db;

create table "Competition"
(
    id          text not null
        primary key,
    name        text not null,
    "countryId" text not null
        references "Country"
            on update cascade on delete restrict,
    "imageSlug" text
);

alter table "Competition"
    owner to db;

create unique index "Country_code_key"
    on "Country" (code);

create unique index "Country_name_key"
    on "Country" (name);

create table "Team"
(
    id          text not null
        primary key,
    name        text not null,
    "countryId" text not null
        references "Country"
            on update cascade on delete restrict,
    "imageSlug" text
);

alter table "Team"
    owner to db;

create table "Player"
(
    id                   text         not null
        primary key,
    "firstName"          text         not null,
    "lastName"           text         not null,
    "dateOfBirth"        timestamp(3) not null,
    "imageSlug"          text,
    "countryId"          text         not null
        references "Country"
            on update cascade on delete restrict,
    "primaryPosition"    "Position"   not null,
    "primaryShirtNumber" integer      not null,
    "teamId"             text
                                      references "Team"
                                          on update cascade on delete set null
);

alter table "Player"
    owner to db;

create table "Game"
(
    id                 text         not null
        primary key,
    "competitionId"    text         not null
        references "Competition"
            on update cascade on delete restrict,
    "homeTeamId"       text         not null
        references "Team"
            on update cascade on delete restrict,
    "awayTeamId"       text         not null
        references "Team"
            on update cascade on delete restrict,
    "gameStatisticsId" text,
    "kickoffTime"      timestamp(3) not null,
    "isOver"           boolean      not null
);

alter table "Game"
    owner to db;

create table "Goal"
(
    id                 text            not null
        primary key,
    "scorerId"         text            not null
        references "Player"
            on update cascade on delete restrict,
    "isOwnGoal"        boolean         not null,
    "scoredInMinute"   numeric(65, 30) not null,
    "scoredInHalftime" "Halftime"      not null,
    "assistentId"      text
                                       references "Player"
                                           on update cascade on delete set null
);

alter table "Goal"
    owner to db;

create table "GameStatistics"
(
    id                         text             not null
        primary key,
    "homeTeamBallPossession"   double precision not null,
    "homeTeamTotalShots"       integer          not null,
    "homeTeamShotsOnTarget"    integer          not null,
    "homeTeamCornerKicks"      integer          not null,
    "awayTeamBigChances"       integer          not null,
    "awayTeamCornerKicks"      integer          not null,
    "awayTeamFouls"            integer          not null,
    "awayTeamOffsides"         integer          not null,
    "awayTeamShotsOnTarget"    integer          not null,
    "awayTeamTotalShots"       integer          not null,
    "awayTeamcrosses"          integer          not null,
    "awayTeamdribbles"         integer          not null,
    "awayTeamdriblesSucessful" integer          not null,
    "awayTeampasses"           integer          not null,
    "awayTeamtackles"          integer          not null,
    "homeTeamBigChances"       integer          not null,
    "homeTeamFouls"            integer          not null,
    "homeTeamOffsides"         integer          not null,
    "homeTeamCrosses"          integer          not null,
    "homeTeamDribbles"         integer          not null,
    "homeTeamDriblesSucessful" integer          not null,
    "homeTeamPasses"           integer          not null,
    "homeTeamTackles"          integer          not null,
    "gameId"                   text             not null
        references "Game"
            on update cascade on delete restrict
);

alter table "GameStatistics"
    owner to db;

create unique index "GameStatistics_gameId_key"
    on "GameStatistics" ("gameId");

create table "CardAwarded"
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
    halftime   "Halftime"      not null,
    minute     numeric(65, 30) not null
);

alter table "CardAwarded"
    owner to db;

create table "User"
(
    id          text       not null
        primary key,
    "firstName" text       not null,
    "lastName"  text       not null,
    email       text       not null,
    role        "UserRole" not null,
    "imageSlug" text
);

alter table "User"
    owner to db;

create table "FavouriteTeam"
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

alter table "FavouriteTeam"
    owner to db;

create table "FavouritePlayer"
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

alter table "FavouritePlayer"
    owner to db;

create table "HighlightedCompetitions"
(
    id              text not null
        primary key,
    "competitionId" text not null
        references "Competition"
            on update cascade on delete restrict
);

alter table "HighlightedCompetitions"
    owner to db;

create table "HighlightedTeam"
(
    id       text not null
        primary key,
    "teamId" text not null
        references "Team"
            on update cascade on delete restrict
);

alter table "HighlightedTeam"
    owner to db;

create table "PlayerInGameLineup"
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

alter table "PlayerInGameLineup"
    owner to db;

create table "TeamInCompetition"
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

alter table "TeamInCompetition"
    owner to db;

create table "Manager"
(
    id          text not null
        primary key,
    "firstName" text not null,
    "lastName"  text not null,
    "teamId"    text
                     references "Team"
                         on update cascade on delete set null
);

alter table "Manager"
    owner to db;

create unique index "Manager_teamId_key"
    on "Manager" ("teamId");

create table "PreviousManager"
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

alter table "PreviousManager"
    owner to db;

create table "PreviousTeam"
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

alter table "PreviousTeam"
    owner to db;

create table "GoalInGame"
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

alter table "GoalInGame"
    owner to db;


