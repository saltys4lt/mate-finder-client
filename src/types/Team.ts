export default interface Team {
  game: 'cs2' | 'valorant';
  ownerId: number;
  name: string;
  avatar: string;
  description: string;
  public: boolean;
  players: string[];
}
