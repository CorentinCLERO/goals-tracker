import { useState } from 'react';
import { useAuth } from '../contexts/auth-context';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { Button } from './ui/button';
import { LayoutDashboard, Target, CheckCircle2, BarChart3, Trophy, User, LogOut, Menu, X } from 'lucide-react';
import { toast } from 'sonner';

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth');
    toast.success('Logged out successfully');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'goals', label: 'Goals', icon: Target, path: '/goals' },
    { id: 'habits', label: 'Habits', icon: CheckCircle2, path: '/habits' },
    { id: 'stats', label: 'Stats', icon: BarChart3, path: '/stats' },
    { id: 'gamification', label: 'Gamification', icon: Trophy, path: '/gamification' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
  ];

  const currentPath = location.pathname;

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Target className="size-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl">Goal & Habit Tracker</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Welcome, {user?.name}
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {navItems.map(item => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentPath === item.path ? 'default' : 'ghost'}
                    onClick={() => handleNavClick(item.path)}
                    className="gap-2"
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Button>
                );
              })}
              <Button variant="ghost" onClick={handleLogout} className="gap-2 text-red-600">
                <LogOut className="size-4" />
                Logout
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="size-6" />
              ) : (
                <Menu className="size-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <nav className="px-4 py-2 space-y-1">
              {navItems.map(item => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentPath === item.path ? 'default' : 'ghost'}
                    onClick={() => handleNavClick(item.path)}
                    className="w-full justify-start gap-2"
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Button>
                );
              })}
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start gap-2 text-red-600"
              >
                <LogOut className="size-4" />
                Logout
              </Button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Goal & Habit Tracker - Build better habits, achieve your goals
          </p>
        </div>
      </footer>
    </div>
  );
}
