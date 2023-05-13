import { prisma } from "~/util/prisma";
import { TeamInSeasonFormElement, getTeamsInCompetitionSeason, getTeamsInCompetitionSeasonById } from "./teams";
import { type Option } from "~/components/form-helpers";

export const getTeamInCompetitionSeasons = async (
  teamId: string
): Promise<TeamInSeasonFormElement[]> => {
  return prisma.teamInCompetition
    .findMany({
      where: {
        teamId,
      },
    })
    .then((seasons) =>
      seasons.map(
        (s) =>
          ({
            competitionSeasonId: s.competitionInSeasonId,
            id: s.id,
          } satisfies TeamInSeasonFormElement)
      )
    );
};

export const getCompetitionSeasons = async () => {
  return prisma.competitionInSeason
    .findMany({
      orderBy: [
        {
          competition: { name: "asc" },
        },
        {
          season: { title: "desc" },
        },
      ],
      select: {
        id: true,
        competition: {
          select: {
            name: true,
          },
        },

        season: {
          select: {
            title: true,
          },
        },
        competitionId: true,
        seasonId: true,
      },
    })
    .then((seasons) =>
      seasons.map((s) => ({
        value: s.id,
        label: `${s.competition.name} - ${s.season.title}`,
        competitionId: s.competitionId,
        seasonId: s.seasonId,
      }))
    );
};

export const getTableForCompetitionInSeason = async (competitionSeasonId: string) => {
  const info = await prisma.competitionInSeason.findFirstOrThrow({
    where: {
      id: competitionSeasonId
    }
  });

  return getTableForCompetition(info.competitionId, info.seasonId);
}

export const getTableForCompetition = async (
  competitionId: string,
  seasonId: string
) => {
  const teams = await getTeamsInCompetitionSeason(competitionId, seasonId);

  const winners: {
    id: string;
    homeTeamId: string;
    awayTeamId: string;
    winner: -1 | 0 | 1;
  }[] = await prisma.$queryRaw`
  select "Game".id as id,
       "homeTeamId",
       "awayTeamId",
       case
           when
                   count(distinct homeTeamGoal.id) >
                   count(distinct awayTeamGoal.id) then 1
           when
                   count(distinct homeTeamGoal.id) <
                   count(distinct awayTeamGoal.id) then -1
           else 0
           end as winner
from "Game"
         left join "Goal" as homeTeamGoal on "Game".id = homeTeamGoal."gameId" and homeTeamGoal."isHomeTeamGoal" = true
         left join "Goal" as awayTeamGoal on "Game".id = awayTeamGoal."gameId" and awayTeamGoal."isHomeTeamGoal" = false
where "Game"."competitionId" = ${competitionId}
  and "Game"."seasonId" = ${seasonId}
group by "Game".id;
  `;

  const teamPoints = new Map<
    string,
    { played: number; wins: number; losses: number; points: number }
  >();

  for (let winer of winners) {
    let currHomePoints = teamPoints.get(winer.homeTeamId);

    if (!currHomePoints) {
      const points = { played: 0, wins: 0, losses: 0, points: 0 };
      teamPoints.set(winer.homeTeamId, points);
      currHomePoints = points;
    }

    currHomePoints.played++;
    if (winer.winner === 0) {
      currHomePoints.points += 1;
    } else if (winer.winner === 1) {
      currHomePoints.wins++;
      currHomePoints.points += 3;
    } else {
      currHomePoints.losses++;
    }

    let currAwayPoints = teamPoints.get(winer.awayTeamId);

    if (!currAwayPoints) {
      const points = { played: 0, wins: 0, losses: 0, points: 0 };
      teamPoints.set(winer.awayTeamId, points);
      currAwayPoints = points;
    }

    currAwayPoints.played++;
    if (winer.winner === 0) {
      currAwayPoints.points++;
    } else if (winer.winner === -1) {
      currAwayPoints.points += 3;
      currAwayPoints.wins++;
    } else {
      currAwayPoints.losses++;
    }
  }

  const table = teams.map((team) => ({
    ...team.team,
    ...teamPoints.get(team.team.id),
  }));

  table.sort((a, b) => {
    if ((a.points ?? 0) > (b.points ?? 0)) return -1;
    if ((a.points ?? 0) < (b.points ?? 0)) return 1;
    return 0;
  });

  return table;
};

export const getLatestSeasonForCompetition = (competitionId: string) => {
  return prisma.competitionInSeason.findFirstOrThrow({
    where: {
      competitionId,
    },
    orderBy: {
      seasonId: "desc",
    },
    select: {
      seasonId: true,
    },
  });
};

export const getCompetitionDetail = (id: string) => {
  return prisma.competition.findUniqueOrThrow({
    where: {
      id,
    },

    select: {
      name: true,
      country: {
        select: {
          name: true,
          imageSlug: true,
        },
      },
    },
  });
};

export const getCompetitionOptions = () => {
  return prisma.competition
    .findMany({
      select: {
        id: true,
        name: true,
        country: {
          select: {
            name: true,
          },
        },
      },
    })
    .then((competitions) =>
      competitions.map((c) => ({
        label: `${c.country.name} - ${c.name}`,
        value: c.id,
      }))
    );
};
