// API Goal types
export interface ApiGoalRequest {
  title: string;
  description: string;
  category: string;
  priority: string; // HIGH, MEDIUM, LOW
  status: string; // ACTIVE, COMPLETED, ABANDONED
  startDate: string;
  deadline: string;
}

export interface ApiGoalResponse {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  startDate: string;
  deadline: string;
}

export interface ApiGoalProgressResponse {
  progress: number;
}

export interface ApiGoalsQueryParams {
  status?: string;
  priority?: string;
  sortBy?: string;
  sortDirection?: string;
}
