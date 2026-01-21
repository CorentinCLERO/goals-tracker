import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/auth-context';
import { Auth } from './pages/Auth';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Goals } from './pages/Goals';
import { Habits } from './pages/Habits';
import { Profile } from './pages/Profile';
import { Gamification } from './pages/Gamification';
import { Toaster } from './components/ui/sonner';

function AppContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user) {
    return <Auth />;
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'goals' && <Goals />}
      {activeTab === 'habits' && <Habits />}
      {activeTab === 'gamification' && <Gamification />}
      {activeTab === 'profile' && <Profile />}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  );
}