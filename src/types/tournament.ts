
export interface Tournament {
  id: string;
  name: string;
  date: string;
  time: string;
  buy_in: string;
  prize: string;
  max_players: number;
  special_features?: string;
  created_at: string;
  updated_at: string;
}

export type TournamentData = Omit<Tournament, 'id' | 'created_at' | 'updated_at'>;
