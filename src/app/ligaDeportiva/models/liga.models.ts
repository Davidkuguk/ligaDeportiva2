// este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
// Estas interfaces describen la forma de los datos que usamos en el frontend.
// esta interfaz marca la forma que tienen los datos de NewsItem.
export interface NewsItem {
  id: number;
  title: string;
  summary: string;
  image: string;
  alt: string;
}

// esta interfaz marca la forma que tienen los datos de MatchResult.
export interface MatchResult {
  localTeam: string;
  awayTeam: string;
  score: string;
  competition: string;
  round: string;
  date: string;
}

// esta interfaz marca la forma que tienen los datos de Team.
export interface Team {
  name: string;
  competition: string;
  captain: string;
  image: string;
  players: string[];
}

// esta interfaz marca la forma que tienen los datos de Standing.
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

// esta interfaz marca la forma que tienen los datos de Player.
export interface Player {
  name: string;
  nickname: string;
  number: number;
  position: string;
  team: string;
  competition: string;
  stats: string[];
}

// esta interfaz marca la forma que tienen los datos de Referee.
export interface Referee {
  name: string;
  nickname: string;
  country: string;
  category: string;
  competition: string;
  stats: string[];
}

