export interface ApiLoginRequest {
  email: string;
  password: string;
}

export interface ApiRegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface ApiLoginResponse {
  token: string;
}

export interface ApiUserResponse {
  id: string;
  email: string;
  name: string;
  level: number;
  xpPoints: number;
  createdAt: string;
  updatedAt: string;
}
