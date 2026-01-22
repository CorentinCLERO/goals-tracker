import React, { useState } from 'react';
import { useAuth } from '../contexts/auth-context';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { User, Save, Trophy, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useGamification } from '../hooks/useGamification';

export function Profile() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  
  const { userProgress, availableBadges, loading } = useGamification(user?.id || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(name, email);
    toast.success('Profile updated successfully!');
  };

  const unlockedBadgeIds = new Set(userProgress.badges.map(b => b.badgeId));
  const unlockedBadges = availableBadges.filter(badge => unlockedBadgeIds.has(badge.id));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-3xl mb-2">Profile</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Gamification Stats */}
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-purple-600 p-3 rounded-full">
              <Trophy className="size-6 text-white" />
            </div>
            <div>
              <CardTitle>Your Achievements</CardTitle>
              <CardDescription>Level {userProgress.level} • {userProgress.xp} XP</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Badges Unlocked</span>
              <Badge variant="secondary" className="bg-yellow-500 text-white">
                {unlockedBadgeIds.size} / {availableBadges.length}
              </Badge>
            </div>
            
            {unlockedBadges.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {unlockedBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-yellow-400 rounded-lg"
                  >
                    <span className="text-2xl">{badge.icon}</span>
                    <div>
                      <div className="text-sm font-medium">{badge.name}</div>
                      <div className="text-xs text-muted-foreground">{badge.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {unlockedBadges.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Complete goals and maintain streaks to unlock badges!
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-3 rounded-full">
              <User className="size-6 text-indigo-600" />
            </div>
            <div>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Account Created</Label>
              <p className="text-sm text-muted-foreground">
                {user?.createdAt && new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>

            <Button type="submit" className="w-full">
              <Save className="size-4 mr-2" />
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
          <CardDescription>Goal & Habit Tracker Application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            This application helps you track your personal and professional goals while
            building positive habits through gamification and progress tracking.
          </p>
          <p className="text-xs">
            Note: Data is stored locally in your browser. Clearing browser data will
            reset your progress.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}