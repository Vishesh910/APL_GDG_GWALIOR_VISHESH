export interface Player {
  id: string;
  name: string;
  role: 'Batter' | 'Bowler' | 'All-Rounder' | 'Wicketkeeper';
  team: string;
  price: number;
  credits: number;
  formRating: number; // out of 10
  stats: {
    matches: number;
    runs?: number;
    strikeRate?: number;
    wickets?: number;
    economy?: number;
  };
}

export interface MatchState {
  id: string;
  teamA: string;
  teamB: string;
  teamALogo: string;
  teamBLogo: string;
  teamAScore: {
    runs: number;
    wickets: number;
    overs: number;
  };
  teamBScore: {
    runs: number;
    wickets: number;
    overs: number;
  };
  target?: number;
  currentInnings: 1 | 2;
  batsmen: {
    name: string;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    strikeRate: number;
    isOnStrike: boolean;
  }[];
  bowlers: {
    name: string;
    overs: number;
    maidens: number;
    runs: number;
    wickets: number;
    economy: number;
  }[];
  winProbability: { [key: string]: number }; // e.g. { MI: 54, CSK: 46 }
  requiredRunRate?: number;
  currentRunRate: number;
  statusText: string;
  oversHistory: {
    overNum: number;
    balls: {
      ballNum: number;
      runs: number;
      type: 'normal' | 'wide' | 'no-ball' | 'wicket' | 'boundary-four' | 'boundary-six';
      commentary: string;
    }[];
  }[];
}

export interface CommentaryItem {
  overNum: number;
  ballNum: number;
  text: string;
  type: 'runs' | 'wicket' | 'boundary' | 'milestone' | 'tactical';
  batsman: string;
  bowler: string;
  runs: number;
}

export interface FantasySuggestion {
  team: Player[];
  captain: Player;
  viceCaptain: Player;
  differentialPicks: Player[];
  reasoning: string;
}

export interface TeamStanding {
  position: number;
  team: string;
  played: number;
  won: number;
  lost: number;
  points: number;
  nrr: number;
}
