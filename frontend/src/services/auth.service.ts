import type { LoginFormData } from "../schemas/login.schema";
import { api } from "../api/api";
import type { RegisterFormData } from "../schemas/register.schema";
export interface LoginResponse {
  accessToken: string;
}
export interface UserOption {
  id: string;
  name: string;
}
type RegisterRequest = Omit<RegisterFormData, "confirmPassword">;

export const AuthService = {
  login: async (data: LoginFormData): Promise<LoginResponse> => {
    return api.post<LoginResponse, LoginResponse>("/auth/login", data);
  },
  register: async (data: RegisterRequest): Promise<void> => {
    return api.post<unknown, void>("/auth/register", data);
  },
  getUsers: async (): Promise<UserOption[]> => {
    return api.get<unknown, UserOption[]>("/auth/users");
  },
};
