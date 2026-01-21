import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/auth-context';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Auth } from './pages/Auth';
import { Goals } from './pages/Goals';
import { Habits } from './pages/Habits';

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
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
