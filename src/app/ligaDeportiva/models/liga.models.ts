// Estas interfaces describen la forma de los datos que usamos en el frontend y en MongoDB.
export interface NewsItem {
  id: number;
  title: string;
  summary: string;
  image: string;
  alt: string;
}

export interface MatchResult {
  localTeam: string;
  awayTeam: string;
  score: string;
  competition: string;
  round: string;
  date: string;
}

export interface Team {
  name: string;
  competition: string;
  captain: string;
  image: string;
  players: string[];
}

export interface Standing {
  position: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  competition: string;
}

export interface Player {
  name: string;
  nickname: string;
  number: number;
  position: string;
  team: string;
  competition: string;
  stats: string[];
}

export interface Referee {
  name: string;
  nickname: string;
  country: string;
  category: string;
  competition: string;
  stats: string[];
}
