import { useState, useEffect, useCallback } from "react";
import type { Badge, UserAchievement, UserProgress } from "../types";
import type {
  ApiBadgeResponse,
  ApiUserXpResponse,
} from "../types/gamification.api";
import * as gamificationApi from "../lib/gamificationApi";

function mapApiBadgeToBadge(apiBadge: ApiBadgeResponse): Badge {
  return {
    id: apiBadge.name,
    name: apiBadge.name,
    description: apiBadge.description,
    icon: apiBadge.icon,
    requirement: apiBadge.criteria,
  };
}

function mapApiBadgeToUserAchievement(
  apiBadge: ApiBadgeResponse,
): UserAchievement {
  return {
    id: apiBadge.id,
    userId: "",
    badgeId: apiBadge.name,
    unlockedAt: apiBadge.earnedAt || new Date().toISOString(),
    seen: true,
  };
}

export function useGamification(userId: string) {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    userId,
    xp: 0,
    level: 1,
    badges: [],
  });
  const [availableBadges, setAvailableBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGamificationData = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      const [userXpData, userBadges, allBadges] = await Promise.all([
        gamificationApi.getUserXp(),
        gamificationApi.getUserBadges(),
        gamificationApi.getAllBadges(),
      ]);

      const mappedAvailableBadges = allBadges.map(mapApiBadgeToBadge);
      const mappedUserBadges = userBadges.map((badge) => ({
        ...mapApiBadgeToUserAchievement(badge),
        userId,
      }));

      setAvailableBadges(mappedAvailableBadges);
      setUserProgress({
        userId,
        xp: userXpData.xpPoints,
        level: userXpData.level,
        badges: mappedUserBadges,
      });
    } catch (err) {
      console.error("Error loading gamification data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load gamification data",
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadGamificationData();
  }, [loadGamificationData]);

  return {
    userProgress,
    availableBadges,
    loading,
    error,
    refetch: loadGamificationData,
  };
}

export function useUserXp(userId: string) {
  const [xpData, setXpData] = useState<ApiUserXpResponse>({
    xpPoints: 0,
    level: 1,
    levelName: "Débutant",
    xpNeededForNextLevel: 100,
    currentLevelXp: 0,
    nextLevelXp: 100,
    totalBadges: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadXpData = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await gamificationApi.getUserXp();
      setXpData(data);
    } catch (err) {
      console.error("Error loading XP data:", err);
      setError(err instanceof Error ? err.message : "Failed to load XP data");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadXpData();
  }, [loadXpData]);

  return {
    xpData,
    loading,
    error,
    refetch: loadXpData,
  };
}
