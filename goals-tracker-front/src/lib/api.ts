const API_BASE_URL = "http://localhost:8080/api";

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

interface LoginResponse {
  token: string;
}

interface UserResponse {
  id: string;
  email: string;
  name: string;
  level: number;
  xpPoints: number;
  createdAt: string;
  updatedAt: string;
}

interface ApiError {
  error: string;
  message?: string;
  details?: Record<string, string>;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    // Get token from localStorage on initialization
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token");
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorData: ApiError;
      try {
        errorData = await response.json();
      } catch {
        // If response is not JSON, create a generic error
        errorData = {
          error: "Unknown error",
          message: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const error = new Error(errorData.message || errorData.error) as any;
      error.status = response.status;
      error.details = errorData.details;
      error.type = errorData.error;
      throw error;
    }

    return response.json();
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("auth_token", token);
      } else {
        localStorage.removeItem("auth_token");
      }
    }
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await this.request<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      this.setToken(response.token);
      return response;
    } catch (error: any) {
      if (error.status === 400 && error.type === "Validation failed") {
        throw new Error("Veuillez vérifier vos informations de connexion.");
      }
      if (error.status === 500) {
        throw new Error("Email ou mot de passe incorrect.");
      }
      throw new Error(error.message || "Erreur lors de la connexion.");
    }
  }

  async register(userData: RegisterRequest): Promise<UserResponse> {
    try {
      const response = await this.request<UserResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      });
      return response;
    } catch (error: any) {
      if (error.status === 409 && error.type === "Email already exists") {
        throw new Error("Cet email est déjà utilisé.");
      }
      if (error.status === 400 && error.type === "Validation failed") {
        // Handle validation errors
        if (error.details) {
          const validationErrors = Object.values(error.details);
          throw new Error(validationErrors.join(", "));
        }
        throw new Error("Veuillez vérifier vos informations.");
      }
      throw new Error(error.message || "Erreur lors de l'inscription.");
    }
  }

  async getCurrentUser(): Promise<UserResponse> {
    return this.request<UserResponse>("/auth/me");
  }

  logout() {
    this.setToken(null);
  }
}

export const apiClient = new ApiClient();
