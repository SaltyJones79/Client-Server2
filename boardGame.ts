// Interface for board game data
export interface BoardGame {
    id: number;
    name: string;
    timesPlayed: number;
    lastPlayed: string;
    rating: number;
    wins: number;
    category: string;
  }  