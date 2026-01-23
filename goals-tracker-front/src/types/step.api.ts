export interface ApiStepRequest {
  title: string;
  deadline: string;
  position: number;
  isCompleted?: boolean;
  completedAt?: string;
}

export interface ApiStepResponse {
  id: string;
  title: string;
  deadline: string;
  isCompleted: boolean;
  position: number;
  completedAt?: string;
  createdAt: string;
}

export interface ApiUpdateStepRequest {
  title?: string;
  deadline?: string;
  position?: number;
}
