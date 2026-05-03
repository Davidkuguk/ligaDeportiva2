// este archivo forma parte de la aplicacion Angular y dejo anotado para que se entienda mejor su funcion.
import { MatchResult, NewsItem, Player, Referee, Standing, Team } from '../models/liga.models';

// Este tipo agrupa todos los bloques de datos que necesita la web de la liga.
// esta interfaz marca la forma que tienen los datos de LigaSeedData.
export interface LigaSeedData {
  news: NewsItem[];
  results: MatchResult[];
  teams: Team[];
  standings: Standing[];
  players: Player[];
  referees: Referee[];
}

// Estos datos se usan como contenido inicial de la aplicacion.
// exporto esta constante para poder reutilizarla desde otros archivos.
export const LIGA_SEED_DATA: LigaSeedData = {
  news: [
    {
      id: 1,
      title: 'Antoni fuerza el partido decisivo',
      summary: 'El equipo azul mantiene vivas sus opciones tras una remontada en el tramo final.',
      image: '/img/futbolista.avif',
      alt: 'Jugador celebrando una accion decisiva',
    },
    {
      id: 2,
      title: 'Isabela lidera el cuadro juvenil',
      summary: 'La tenista del instituto sigue invicta y apunta a la final del torneo.',
      image: '/img/tenista.avif',
      alt: 'Tenista preparando el saque',
    },
    {
      id: 3,
      title: 'La maraton escolar bate participacion',
      summary: 'Mas de doscientos alumnos completaron el recorrido por las calles del barrio.',
      image: '/img/maraton.avif',
      alt: 'Grupo de corredores en una prueba popular',
    },
  ],
  results: [
    {
      localTeam: 'Azules',
      awayTeam: 'Titanes',
      score: '3-1',
      competition: 'Liga Principal',
      round: 'Jornada 8',
      date: '2026-03-21',
    },
    {
      localTeam: 'Guerreros',
      awayTeam: 'Naranja',
      score: '78-72',
      competition: 'Copa Regional',
      round: 'Semifinal',
      date: '2026-03-20',
    },
    {
      localTeam: 'Monteverde',
      awayTeam: 'Halcones',
      score: '2-0',
      competition: 'Torneo Juvenil',
      round: 'Jornada 5',
      date: '2026-03-19',
    },
  ],
  teams: [
    {
      name: 'Azules',
      competition: 'Liga Principal',
      captain: 'Ruben Vidal',
      image: '/img/duelo.avif',
      players: ['Antoni Ruiz', 'Leo Ramos', 'Iker Soto', 'Mario Cano'],
    },
    {
      name: 'Titanes',
      competition: 'Liga Principal',
      captain: 'Pablo Nunez',
      image: '/img/duelo2.avif',
      players: ['Dario Leon', 'Adrian Rico', 'Sergio Gil', 'Hugo Costa'],
    },
    {
      name: 'Monteverde',
      competition: 'Torneo Juvenil',
      captain: 'Isabela Mora',
      image: '/img/duelo3.avif',
      players: ['Isabela Mora', 'Noa Perez', 'Lucia Vela', 'Nora Sanz'],
    },
  ],
  standings: [
    {
      position: 1,
      team: 'Azules',
      played: 8,
      won: 6,
      drawn: 1,
      lost: 1,
      goalsFor: 19,
      goalsAgainst: 9,
      points: 19,
      competition: 'Liga Principal',
    },
    {
      position: 2,
      team: 'Titanes',
      played: 8,
      won: 5,
      drawn: 2,
      lost: 1,
      goalsFor: 16,
      goalsAgainst: 10,
      points: 17,
      competition: 'Liga Principal',
    },
    {
      position: 3,
      team: 'Guerreros',
      played: 8,
      won: 4,
      drawn: 1,
      lost: 3,
      goalsFor: 14,
      goalsAgainst: 12,
      points: 13,
      competition: 'Liga Principal',
    },
  ],
  players: [
    {
      name: 'Antoni Ruiz',
      nickname: 'Toro',
      number: 9,
      position: 'Delantero',
      team: 'Azules',
      competition: 'Liga Principal',
      stats: ['7 goles', '3 asistencias', '1 MVP'],
    },
    {
      name: 'Isabela Mora',
      nickname: 'Ace',
      number: 1,
      position: 'Tenista',
      team: 'Monteverde',
      competition: 'Torneo Juvenil',
      stats: ['5 victorias', '0 derrotas', '84% de primeros saques'],
    },
    {
      name: 'Leo Ramos',
      nickname: 'Flash',
      number: 11,
      position: 'Extremo',
      team: 'Azules',
      competition: 'Liga Principal',
      stats: ['4 goles', '5 asistencias', '12 recuperaciones'],
    },
  ],
  referees: [
    {
      name: 'Celia Mena',
      nickname: 'La Juez',
      country: 'Espana',
      category: 'Nacional escolar',
      competition: 'Liga Principal',
      stats: ['12 partidos', '49 tarjetas', '0 incidentes graves'],
    },
    {
      name: 'Marcos Vidal',
      nickname: 'Silbato',
      country: 'Espana',
      category: 'Regional',
      competition: 'Copa Regional',
      stats: ['9 partidos', '31 tarjetas', '2 penaltis senalados'],
    },
  ],
};

