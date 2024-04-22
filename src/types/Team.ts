import Player from './Player';

export default interface Team {
  game: 'cs2' | 'valorant';
  owner: string;
  name: string;
  avatar: string;
  description: string;
  public: boolean;
  neededRoles: string[];
  players: Player[];
}
