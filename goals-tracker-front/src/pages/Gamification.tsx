import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge as BadgeUI } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Button } from '../components/ui/button';
import { 
  BADGES, 
  CHALLENGES, 
  getUserProgress, 
  checkAllBadges,
  unlockBadge,
  getXpForNextLevel,
  getXpProgress
} from '../lib/gamification';
import { Trophy, Star, Zap, Target } from 'lucide-react';
import { toast } from 'sonner';
import type { UserAchievement } from '../types';

export function Gamification() {
  const { user } = useAuth();
  const [userProgress, setUserProgress] = useState({ xp: 0, level: 1, badges: [] as UserAchievement[] });
  const [unlockedBadges, setUnlockedBadges] = useState<Set<string>>(new Set());

  const loadProgress = useCallback(() => {
    if (!user) return;

    const progress = getUserProgress(user.id);
    setUserProgress(progress);

    const unlocked = new Set(progress.badges.map(b => b.badgeId));
    setUnlockedBadges(unlocked);

    // Check for newly unlocked badges
    const newBadges = checkAllBadges(user.id, progress.badges);
    
    newBadges.forEach(badgeId => {
      unlockBadge(user.id, badgeId);
      const badge = BADGES.find(b => b.id === badgeId);
      
      if (badge) {
        toast.success(`🎉 Badge Unlocked: ${badge.name}`, {
          description: badge.description,
        });
      }
      
      unlocked.add(badgeId);
    });

    if (newBadges.length > 0) {
      const updatedProgress = getUserProgress(user.id);
      setUserProgress(updatedProgress);
      setUnlockedBadges(new Set(unlocked));
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProgress();
  }, [user, loadProgress]);

  const nextLevelXp = getXpForNextLevel(userProgress.level);
  const progressPercent = getXpProgress(userProgress.xp, userProgress.level);

  const isBadgeUnlocked = (badgeId: string) => unlockedBadges.has(badgeId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl mb-2">Gamification</h2>
        <p className="text-muted-foreground">
          Track your progress, unlock badges, and complete challenges
        </p>
      </div>

      {/* Level & XP Card */}
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-3 rounded-full">
                <Star className="size-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Level {userProgress.level}</CardTitle>
                <CardDescription className="text-indigo-700">
                  {userProgress.xp} XP • {nextLevelXp - userProgress.xp} XP to next level
                </CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-indigo-600">{userProgress.xp}</div>
              <div className="text-sm text-muted-foreground">Total XP</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Level {userProgress.level + 1}</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Trophy className="size-5 text-yellow-600" />
            <div>
              <CardTitle>Badges</CardTitle>
              <CardDescription>
                {unlockedBadges.size} of {BADGES.length} unlocked
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {BADGES.map((badge) => {
              const unlocked = isBadgeUnlocked(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    unlocked
                      ? 'border-yellow-400 bg-yellow-50 shadow-md'
                      : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-4xl">{unlocked ? badge.icon : '🔒'}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{badge.name}</h4>
                        {unlocked && (
                          <BadgeUI variant="secondary" className="text-xs bg-yellow-500 text-white">
                            Unlocked
                          </BadgeUI>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {badge.description}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Target className="size-3" />
                        <span>{badge.requirement}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Challenges */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Zap className="size-5 text-orange-600" />
            <div>
              <CardTitle>Active Challenges</CardTitle>
              <CardDescription>
                Complete challenges to earn bonus XP
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {CHALLENGES.map((challenge) => (
              <div
                key={challenge.id}
                className="p-4 border rounded-lg bg-gradient-to-r from-orange-50 to-red-50 border-orange-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{challenge.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {challenge.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <BadgeUI variant="secondary" className="bg-orange-500 text-white">
                        +{challenge.xpReward} XP
                      </BadgeUI>
                      {challenge.requirement.days && (
                        <span className="text-xs text-muted-foreground">
                          {challenge.requirement.days} days
                        </span>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Track Progress
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* XP Earning Guide */}
      <Card>
        <CardHeader>
          <CardTitle>How to Earn XP</CardTitle>
          <CardDescription>Complete activities to gain experience points</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="bg-green-100 p-2 rounded-full">
                <Trophy className="size-5 text-green-600" />
              </div>
              <div>
                <div className="font-medium">Complete a Goal</div>
                <div className="text-sm text-muted-foreground">+100 XP</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="bg-blue-100 p-2 rounded-full">
                <Target className="size-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium">Complete a Step</div>
                <div className="text-sm text-muted-foreground">+25 XP</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="bg-purple-100 p-2 rounded-full">
                <Zap className="size-5 text-purple-600" />
              </div>
              <div>
                <div className="font-medium">Complete a Habit</div>
                <div className="text-sm text-muted-foreground">+10 XP</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="bg-yellow-100 p-2 rounded-full">
                <Star className="size-5 text-yellow-600" />
              </div>
              <div>
                <div className="font-medium">Unlock a Badge</div>
                <div className="text-sm text-muted-foreground">+50 XP</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
