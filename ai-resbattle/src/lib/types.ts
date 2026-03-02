export interface CategoryScore {
  category: string;
  score1: number;
  score2: number;
  comment: string;
}

export interface RestaurantResult {
  name: string;
  scores: CategoryScore[];
  totalScore: number;
  comment: string;
}

export interface Battle {
  id: string;
  createdAt: string;
  restaurant1: RestaurantResult;
  restaurant2: RestaurantResult;
  winner: "restaurant1" | "restaurant2" | "draw";
  summary: string;
}

export interface BattleRequest {
  restaurant1: string;
  restaurant2: string;
}

export interface BattleResponse {
  id: string;
}
