import { useState } from "react";
import { useAuth } from "./contexts/auth-context";
import { AuthProvider } from "./contexts/AuthContext";
import { Auth } from "./pages/Auth";
import { Layout } from "./components/Layout";
import { Toaster } from "./components/ui/sonner";

function AppContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  if (!user) {
    return <Auth />;
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "dashboard" && (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <p>Welcome to your dashboard, {user.name}!</p>
        </div>
      )}
      {activeTab === "goals" && (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Goals</h1>
          <p>Manage your goals here.</p>
        </div>
      )}
      {activeTab === "habits" && (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Habits</h1>
          <p>Track your habits here.</p>
        </div>
      )}
      {activeTab === "profile" && (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Profile</h1>
          <p>Manage your profile here.</p>
        </div>
      )}
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
