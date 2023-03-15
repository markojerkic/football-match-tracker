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

create table "Country"
(
    id          text not null
        primary key,
    code        text not null,
    name        text not null,
    "imageSlug" text,
    unique("code"),
    unique("name")
);

create table "Competition"
(
    id              text              not null
        primary key,
    name            text              not null,
    "countryId"     text              not null
        references "Country"
            on update cascade on delete restrict,
    "imageSlug"     text,
    "isHighlighted" boolean           not null,
    type            "CompetitionType" not null
);

create table "Group"
(
    id   text not null
        primary key,
    name text not null
);

create table "Team"
(
    id          text not null
        primary key,
    name        text not null,
    "countryId" text not null
        references "Country"
            on update cascade on delete restrict,
    "imageSlug" text,
    "groupId"   text
                     references "Group"
                         on update cascade on delete set null
);

create table "FavouriteTeam"
(
    id       text not null
        primary key,
    "userId" text not null
        references "User"
            on update cascade on delete restrict,
    "teamId" text not null
        references "Team"
            on update cascade on delete restrict,
    foreign key (awayTeamId) references "User"
        on update cascade on delete restrict
);

create table "Manager"
(
    id          text not null
        primary key,
    "firstName" text not null,
    "lastName"  text not null,
    "teamId"    text
                     references "Team"
                         on update cascade on delete set null,
    unique("teamId")
);

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

create table "Player"
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

create table "HighlightedTeam"
(
    id       text not null
        primary key,
    "teamId" text not null
        references "Team"
            on update cascade on delete restrict,
    foreign key (playerId) references "Player"
        on update cascade on delete restrict
);

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

create table "Game"
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
    "isOver"                                    boolean      not null,
    "hasExtraTime"                              boolean      not null,
    "hasPenaltyShootout"                        boolean      not null,
    "firstExtendedHalfEndedAferAdditionalTime"  integer,
    "secondExtendedHalfEndedAferAdditionalTime" integer,
    "firstHalfEndedAferAdditionalTime"          integer      not null,
    "secondHalfEndedAferAdditionalTime"         integer      not null
);

create table "Goal"
(
    id                    text       not null
        primary key,
    "scorerId"            text       not null
        references "Player"
            on update cascade on delete restrict,
    "isOwnGoal"           boolean    not null,
    "scoredInMinute"      integer    not null,
    "scoredInHalftime"    "Halftime" not null,
    "assistentId"         text
                                     references "Player"
                                         on update cascade on delete set null,
    "isPenalty"           boolean    not null,
    "isPenaltyInShootout" boolean    not null
);

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

create table "GameStatistics"
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
    "homeTeamDriblesSucessful" integer          not null,
    "awayTeamTotalShots"       integer          not null,
    "awayTeamShotsOnTarget"    integer          not null,
    "awayTeamCornerKicks"      integer          not null,
    "awayTeamOffsides"         integer          not null,
    "awayTeamFouls"            integer          not null,
    "awayTeamBigChances"       integer          not null,
    "awayTeampasses"           integer          not null,
    "awayTeamcrosses"          integer          not null,
    "awayTeamtackles"          integer          not null,
    "awayTeamdribbles"         integer          not null,
    "awayTeamdriblesSucessful" integer          not null,
    unique("gameId")
);

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
    minute     numeric(65, 30) not null,
    halftime   "Halftime"      not null
);

create table "KnockoutGame"
(
    id             text not null
        primary key,
    "gameId"       text not null
        references "Game"
            on update cascade on delete restrict,
    "returnGameId" text
                        references "Game"
                            on update cascade on delete set null
);

create table "TeamInGroup"
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


