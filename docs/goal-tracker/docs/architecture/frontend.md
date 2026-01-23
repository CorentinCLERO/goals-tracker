# Frontend Architecture

The Goals Tracker frontend is a modern React application built with TypeScript and Vite.

## Technology Stack

- **Framework**: React 19.2
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router
- **UI Components**: shadcn/ui
- **State Management**: React Context / Hooks
- **HTTP Client**: Axios / Fetch
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Architecture Overview

The frontend follows a component-based architecture:

```
┌─────────────────────────────────────┐
│           Pages/Views               │  ← Route Components
├─────────────────────────────────────┤
│        Feature Components           │  ← Business Logic
├─────────────────────────────────────┤
│       Shared Components             │  ← Reusable UI
├─────────────────────────────────────┤
│     Services / API Layer            │  ← HTTP Requests
├─────────────────────────────────────┤
│           Backend API               │  ← REST API
└─────────────────────────────────────┘
```

## Project Structure

```
src/
├── assets/              # Static assets (images, fonts)
├── components/          # Reusable components
│   ├── ui/             # Base UI components (shadcn)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── input.tsx
│   ├── layout/         # Layout components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   └── common/         # Common components
│       ├── Loading.tsx
│       ├── ErrorBoundary.tsx
│       └── ProtectedRoute.tsx
├── features/           # Feature modules
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   └── services/
│   │       └── authService.ts
│   ├── goals/
│   │   ├── components/
│   │   │   ├── GoalList.tsx
│   │   │   ├── GoalCard.tsx
│   │   │   ├── GoalForm.tsx
│   │   │   └── GoalDetails.tsx
│   │   ├── hooks/
│   │   │   └── useGoals.ts
│   │   └── services/
│   │       └── goalService.ts
│   └── habits/
│       ├── components/
│       │   ├── HabitList.tsx
│       │   ├── HabitCard.tsx
│       │   ├── HabitForm.tsx
│       │   └── HabitTracker.tsx
│       ├── hooks/
│       │   └── useHabits.ts
│       └── services/
│           └── habitService.ts
├── pages/              # Page components
│   ├── Dashboard.tsx
│   ├── Goals.tsx
│   ├── Habits.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   └── Profile.tsx
├── contexts/           # React Context providers
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── hooks/             # Custom hooks
│   ├── useApi.ts
│   ├── useLocalStorage.ts
│   └── useDebounce.ts
├── lib/               # Utility libraries
│   ├── api.ts        # API client configuration
│   └── utils.ts      # Helper functions
├── types/            # TypeScript type definitions
│   ├── api.ts
│   ├── models.ts
│   └── index.ts
├── styles/           # Global styles
│   └── globals.css
├── App.tsx           # Main app component
├── main.tsx          # Entry point
└── router.tsx        # Route configuration
```

## Core Concepts

### 1. Component Architecture

Components are organized by feature and responsibility:

**Feature Components** - Specific to a feature (Goals, Habits)
```tsx
// features/goals/components/GoalCard.tsx
interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: number) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onEdit, onDelete }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{goal.title}</CardTitle>
        <Badge variant={getPriorityVariant(goal.priority)}>
          {goal.priority}
        </Badge>
      </CardHeader>
      <CardContent>
        <p>{goal.description}</p>
        <Progress value={goal.progress} />
      </CardContent>
      <CardFooter>
        <Button onClick={() => onEdit(goal)}>Edit</Button>
        <Button variant="destructive" onClick={() => onDelete(goal.id)}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};
```

**Shared Components** - Reusable across features
```tsx
// components/common/Loading.tsx
export const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Spinner className="w-8 h-8 animate-spin" />
    </div>
  );
};
```

### 2. Custom Hooks

Encapsulate reusable logic and side effects:

```tsx
// features/goals/hooks/useGoals.ts
export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const data = await goalService.getAll();
      setGoals(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createGoal = async (goalData: CreateGoalRequest) => {
    const newGoal = await goalService.create(goalData);
    setGoals([...goals, newGoal]);
    return newGoal;
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return { goals, loading, error, fetchGoals, createGoal };
};
```

### 3. Service Layer

API communication abstraction:

```tsx
// features/goals/services/goalService.ts
import { api } from '@/lib/api';
import { Goal, CreateGoalRequest } from '@/types/models';

export const goalService = {
  async getAll(): Promise<Goal[]> {
    const response = await api.get('/api/goals');
    return response.data;
  },

  async getById(id: number): Promise<Goal> {
    const response = await api.get(`/api/goals/${id}`);
    return response.data;
  },

  async create(data: CreateGoalRequest): Promise<Goal> {
    const response = await api.post('/api/goals', data);
    return response.data;
  },

  async update(id: number, data: Partial<Goal>): Promise<Goal> {
    const response = await api.put(`/api/goals/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/api/goals/${id}`);
  },
};
```

### 4. API Client Configuration

```tsx
// lib/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## Routing

### Route Configuration

```tsx
// router.tsx
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'goals',
        element: <GoalsPage />,
      },
      {
        path: 'goals/:id',
        element: <GoalDetails />,
      },
      {
        path: 'habits',
        element: <HabitsPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
]);
```

### Protected Routes

```tsx
// components/common/ProtectedRoute.tsx
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};
```

## State Management

### Authentication Context

```tsx
// contexts/AuthContext.tsx
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    localStorage.setItem('token', response.token);
    setUser(response.user);
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

## TypeScript Types

### Model Definitions

```tsx
// types/models.ts
export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum GoalStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ABANDONED = 'ABANDONED',
}

export interface Goal {
  id: number;
  title: string;
  description?: string;
  priority: Priority;
  status: GoalStatus;
  category?: string;
  startDate?: string;
  dueDate?: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGoalRequest {
  title: string;
  description?: string;
  priority: Priority;
  category?: string;
  dueDate?: string;
}

export interface Habit {
  id: number;
  name: string;
  description?: string;
  frequency: 'DAILY' | 'WEEKLY';
  timesPerWeek?: number;
  category?: string;
  startDate: string;
  active: boolean;
  currentStreak: number;
  bestStreak: number;
}
```

## Styling

### Tailwind CSS Configuration

```js
// tailwind.config.js
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
        },
      },
    },
  },
  plugins: [],
};
```

### Component Styling

```tsx
// Using Tailwind classes
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-bold text-gray-900">{goal.title}</h2>
  <Badge className="bg-blue-500 text-white">{goal.status}</Badge>
</div>
```

## Build Configuration

### Vite Configuration

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
```

## Testing

### Component Testing

```tsx
import { render, screen } from '@testing-library/react';
import { GoalCard } from './GoalCard';

describe('GoalCard', () => {
  const mockGoal: Goal = {
    id: 1,
    title: 'Test Goal',
    priority: Priority.HIGH,
    status: GoalStatus.IN_PROGRESS,
    progress: 50,
  };

  it('renders goal title', () => {
    render(<GoalCard goal={mockGoal} />);
    expect(screen.getByText('Test Goal')).toBeInTheDocument();
  });

  it('displays progress', () => {
    render(<GoalCard goal={mockGoal} />);
    expect(screen.getByText('50%')).toBeInTheDocument();
  });
});
```

## Performance Optimization

### Code Splitting

```tsx
// Lazy load routes
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Goals = lazy(() => import('./pages/Goals'));

<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/goals" element={<Goals />} />
  </Routes>
</Suspense>
```

### Memoization

```tsx
const GoalList = memo(({ goals }: { goals: Goal[] }) => {
  return goals.map(goal => <GoalCard key={goal.id} goal={goal} />);
});

const filteredGoals = useMemo(() => {
  return goals.filter(goal => goal.status === 'IN_PROGRESS');
}, [goals]);
```

## Environment Variables

```env
# .env
VITE_API_URL=http://localhost:8080
VITE_APP_NAME=Goals Tracker
VITE_ENABLE_ANALYTICS=false
```

Access in code:
```tsx
const apiUrl = import.meta.env.VITE_API_URL;
```

## Next Steps

- Explore [Backend Architecture](backend.md)
- Learn about [Frontend Development](../development/frontend.md)
- Understand [Docker Setup](../development/docker.md)
