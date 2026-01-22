export interface ApiBadgeResponse {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: string;
  earnedAt?: string;
}

export interface ApiUserXpResponse {
  xpPoints: number;
  level: number;
  levelName: string;
  xpNeededForNextLevel: number;
  currentLevelXp: number;
  nextLevelXp: number;
  totalBadges: number;
}
