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
  roles?: string[];
  maps?: string[];
}
