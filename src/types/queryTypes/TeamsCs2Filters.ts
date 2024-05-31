export interface TeamsCs2Filters {
  category?: 'all' | 'recs';
  page?: string;
  searchQuery?: string;
  maxElo?: string;
  minElo?: string;
  maxWinrate?: string;
  minWinrate?: string;
  roles?: string[];
  membersAmount?: string;
}
