import { TeamStanding, Player, MatchState } from './types';

export const teamStandings: TeamStanding[] = [
  { position: 1, team: 'Mumbai Indians (MI)', played: 10, won: 7, lost: 3, points: 14, nrr: 0.852 },
  { position: 2, team: 'Chennai Super Kings (CSK)', played: 10, won: 7, lost: 3, points: 14, nrr: 0.612 },
  { position: 3, team: 'Rajasthan Royals (RR)', played: 10, won: 6, lost: 4, points: 12, nrr: 0.432 },
  { position: 4, team: 'Kolkata Knight Riders (KKR)', played: 10, won: 6, lost: 4, points: 12, nrr: 0.281 },
  { position: 5, team: 'Royal Challengers Bengaluru (RCB)', played: 10, won: 5, lost: 5, points: 10, nrr: -0.112 },
  { position: 6, team: 'Delhi Capitals (DC)', played: 10, won: 4, lost: 6, points: 8, nrr: -0.245 },
  { position: 7, team: 'Gujarat Titans (GT)', played: 10, won: 4, lost: 6, points: 8, nrr: -0.381 },
  { position: 8, team: 'Sunrisers Hyderabad (SRH)', played: 10, won: 3, lost: 7, points: 6, nrr: -0.524 },
  { position: 9, team: 'Lucknow Super Giants (LSG)', played: 10, won: 3, lost: 7, points: 6, nrr: -0.689 },
  { position: 10, team: 'Punjab Kings (PBKS)', played: 10, won: 2, lost: 8, points: 4, nrr: -0.912 }
];

export const upcomingMatches = [
  { id: 'up-1', teamA: 'RCB', teamB: 'KKR', date: 'Tomorrow, 7:30 PM', venue: 'M.Chinnaswamy Stadium, Bengaluru', keyBattle: 'Virat Kohli vs Sunil Narine' },
  { id: 'up-2', teamA: 'RR', teamB: 'GT', date: 'May 26, 7:30 PM', venue: 'Sawai Mansingh Stadium, Jaipur', keyBattle: 'Sanju Samson vs Rashid Khan' },
  { id: 'up-3', teamA: 'DC', teamB: 'SRH', date: 'May 27, 7:30 PM', venue: 'Arun Jaitley Stadium, Delhi', keyBattle: 'Rishabh Pant vs Pat Cummins' },
];

export const iplPlayers: Player[] = [
  // MI Players
  { id: 'p1', name: 'Rohit Sharma', role: 'Batter', team: 'MI', price: 10.5, credits: 10.5, formRating: 8.8, stats: { matches: 247, runs: 6211, strikeRate: 130.3 } },
  { id: 'p2', name: 'Suryakumar Yadav', role: 'Batter', team: 'MI', price: 10.0, credits: 10.0, formRating: 9.2, stats: { matches: 139, runs: 3249, strikeRate: 143.2 } },
  { id: 'p3', name: 'Hardik Pandya', role: 'All-Rounder', team: 'MI', price: 9.5, credits: 9.5, formRating: 8.4, stats: { matches: 123, runs: 2310, strikeRate: 139.8, wickets: 64, economy: 8.2 } },
  { id: 'p4', name: 'Jasprit Bumrah', role: 'Bowler', team: 'MI', price: 11.0, credits: 11.0, formRating: 9.7, stats: { matches: 120, wickets: 145, economy: 7.3 } },
  { id: 'p5', name: 'Ishan Kishan', role: 'Wicketkeeper', team: 'MI', price: 9.0, credits: 9.0, formRating: 7.9, stats: { matches: 91, runs: 2324, strikeRate: 134.5 } },

  // CSK Players
  { id: 'p6', name: 'Ruturaj Gaikwad', role: 'Batter', team: 'CSK', price: 10.0, credits: 10.0, formRating: 9.1, stats: { matches: 52, runs: 1797, strikeRate: 135.5 } },
  { id: 'p7', name: 'MS Dhoni', role: 'Wicketkeeper', team: 'CSK', price: 9.0, credits: 9.0, formRating: 8.5, stats: { matches: 250, runs: 5082, strikeRate: 135.9 } },
  { id: 'p8', name: 'Ravindra Jadeja', role: 'All-Rounder', team: 'CSK', price: 10.0, credits: 10.0, formRating: 8.9, stats: { matches: 226, runs: 2692, strikeRate: 128.6, wickets: 152, economy: 7.6 } },
  { id: 'p9', name: 'Matheesha Pathirana', role: 'Bowler', team: 'CSK', price: 9.0, credits: 9.0, formRating: 9.0, stats: { matches: 14, wickets: 21, economy: 7.8 } },
  { id: 'p10', name: 'Shivam Dube', role: 'All-Rounder', team: 'CSK', price: 8.5, credits: 8.5, formRating: 8.7, stats: { matches: 51, runs: 1106, strikeRate: 138.2 } },

  // RCB Players
  { id: 'p11', name: 'Virat Kohli', role: 'Batter', team: 'RCB', price: 11.5, credits: 11.5, formRating: 9.8, stats: { matches: 237, runs: 7263, strikeRate: 130.0 } },
  { id: 'p12', name: 'Glenn Maxwell', role: 'All-Rounder', team: 'RCB', price: 9.5, credits: 9.5, formRating: 7.2, stats: { matches: 124, runs: 2719, strikeRate: 157.6, wickets: 31, economy: 8.1 } },
  { id: 'p13', name: 'Faf du Plessis', role: 'Batter', team: 'RCB', price: 10.0, credits: 10.0, formRating: 8.2, stats: { matches: 130, runs: 4133, strikeRate: 134.1 } },
  { id: 'p14', name: 'Mohammed Siraj', role: 'Bowler', team: 'RCB', price: 9.0, credits: 9.0, formRating: 7.8, stats: { matches: 79, wickets: 78, economy: 8.4 } },

  // KKR Players
  { id: 'p15', name: 'Shreyas Iyer', role: 'Batter', team: 'KKR', price: 9.5, credits: 9.5, formRating: 8.3, stats: { matches: 101, runs: 2776, strikeRate: 125.4 } },
  { id: 'p16', name: 'Sunil Narine', role: 'All-Rounder', team: 'KKR', price: 10.5, credits: 10.5, formRating: 9.5, stats: { matches: 162, runs: 1046, strikeRate: 158.5, wickets: 163, economy: 6.73 } },
  { id: 'p17', name: 'Andre Russell', role: 'All-Rounder', team: 'KKR', price: 10.5, credits: 10.5, formRating: 9.1, stats: { matches: 112, runs: 2262, strikeRate: 174.0, wickets: 96, economy: 9.1 } },
  { id: 'p18', name: 'Rinku Singh', role: 'Batter', team: 'KKR', price: 8.5, credits: 8.5, formRating: 8.6, stats: { matches: 31, runs: 725, strikeRate: 142.1 } },

  // RR Players
  { id: 'p19', name: 'Yashasvi Jaiswal', role: 'Batter', team: 'RR', price: 9.5, credits: 9.5, formRating: 8.6, stats: { matches: 37, runs: 1172, strikeRate: 148.5 } },
  { id: 'p20', name: 'Sanju Samson', role: 'Wicketkeeper', team: 'RR', price: 10.0, credits: 10.0, formRating: 8.9, stats: { matches: 152, runs: 3888, strikeRate: 137.5 } },
  { id: 'p21', name: 'Yuzvendra Chahal', role: 'Bowler', team: 'RR', price: 10.0, credits: 10.0, formRating: 9.0, stats: { matches: 145, wickets: 187, economy: 7.67 } },
  { id: 'p22', name: 'Trent Boult', role: 'Bowler', team: 'RR', price: 9.5, credits: 9.5, formRating: 8.8, stats: { matches: 88, wickets: 105, economy: 7.92 } }
];

export const featuredMatches: MatchState[] = [
  {
    id: 'm-1',
    teamA: 'MI',
    teamB: 'CSK',
    teamALogo: '🔵',
    teamBLogo: '🟡',
    teamAScore: { runs: 188, wickets: 4, overs: 20 },
    teamBScore: { runs: 162, wickets: 5, overs: 17.2 },
    target: 189,
    currentInnings: 2,
    batsmen: [
      { name: 'Shivam Dube', runs: 42, balls: 24, fours: 3, sixes: 3, strikeRate: 175.0, isOnStrike: true },
      { name: 'MS Dhoni', runs: 12, balls: 6, fours: 1, sixes: 1, strikeRate: 200.0, isOnStrike: false }
    ],
    bowlers: [
      { name: 'Jasprit Bumrah', overs: 3.2, maidens: 0, runs: 18, wickets: 2, economy: 5.4 },
      { name: 'Hardik Pandya', overs: 3, maidens: 0, runs: 32, wickets: 1, economy: 10.6 }
    ],
    winProbability: { MI: 68, CSK: 32 },
    requiredRunRate: 10.13,
    currentRunRate: 9.35,
    statusText: 'CSK need 27 runs in 16 balls to win',
    oversHistory: [
      {
        overNum: 17,
        balls: [
          { ballNum: 1, runs: 1, type: 'normal', commentary: 'Bumrah to Shivam Dube, 1 run, tucked away to deep midwicket.' },
          { ballNum: 2, runs: 6, type: 'boundary-six', commentary: 'Bumrah to MS Dhoni, SIX, MASSIVE strike! Vintage Dhoni, stands tall and launches it over bowler\'s head!' },
          { ballNum: 3, runs: 0, type: 'normal', commentary: 'Bumrah to MS Dhoni, no run, blistering yorker, Dhoni squeezes it out to cover.' },
          { ballNum: 4, runs: 1, type: 'normal', commentary: 'Bumrah to MS Dhoni, 1 run, driven to long off to secure the strike rotation.' },
          { ballNum: 5, runs: 4, type: 'boundary-four', commentary: 'Bumrah to Shivam Dube, FOUR, pulled brutally! Shot of authority as Dube finds the deep square boundary.' },
          { ballNum: 6, runs: 1, type: 'normal', commentary: 'Bumrah to Shivam Dube, 1 run, pushed to deep cover to keep strike for next over.' }
        ]
      }
    ]
  }
];

export const mockTeamAnalytics = {
  strengths: {
    MI: ['Elite Death Bowling (Bumrah)', 'Explosive Middle Order Order', 'Exceptional All-Round Depth'],
    CSK: ['Masterly Spin Play', 'Finishing Expertise (Dhoni/Jadeja)', 'Tactical Adaptability & Calmness']
  },
  weaknesses: {
    MI: ['Vulnerability vs Quality Off-spin', 'Inconsistent Opening Stand', 'Leaky 5th Bowler Overs'],
    CSK: ['Prone to Pace-Off variations', 'Slower Powerplay Run Rate', 'Slightly Thin Raw Bowling Velocity']
  },
  nrrTrends: [
    { match: 'Match 1', MI: 0.12, CSK: 0.25 },
    { match: 'Match 3', MI: 0.45, CSK: 0.38 },
    { match: 'Match 5', MI: 0.31, CSK: 0.52 },
    { match: 'Match 7', MI: 0.64, CSK: 0.49 },
    { match: 'Match 9', MI: 0.85, CSK: 0.61 }
  ]
};

export const trendingNews = [
  { id: 'n-1', title: 'Tactical Analysis: How Dube counteracted MI\'s spin threat in the middle overs', time: '10 mins ago', author: 'Live Tactical Agent' },
  { id: 'n-2', title: 'Fantasy Pick Surge: Bumrah\'s death over statistics make him an indispensable Captain choice', time: '1 hour ago', author: 'Fantasy Recommendation Engine' },
  { id: 'n-3', title: 'Sky-high projection: Prediction Agent calculates CSK\'s qualifier qualification at 89%', time: '3 hours ago', author: 'Prediction Algorithm' }
];
