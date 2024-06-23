import { RecentMatch } from './RecentMatch';

export default interface Cs2Data {
  userId: number;
  steamId: string;
  matches: number;
  elo: number;
  winrate: number;
  kd: number;
  wins: number;
  hs: number;
  lvlImg: string;
  roles: Role[];
  maps: Map[];
  recentMatches: RecentMatch[];
}

export type Role = Record<
  'cs2Role',
  {
    name: string;
  }
>;

export type Map = Record<
  'cs2Map',
  {
    name: string;
  }
>;
