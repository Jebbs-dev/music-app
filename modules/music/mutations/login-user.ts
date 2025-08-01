import useAuthStore, { setStorageItem } from "@/store/auth-store";
import api from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Artist, User } from "../types/types";

interface UserAuth {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  userInfo:  Partial<User | Artist> ; // Add user data if your backend returns it
}

export const useLoginUser = () => {
  const { login } = useAuthStore();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user: UserAuth) => {
      const response = await api.post<LoginResponse>("/auth/login", user);
      return response.data;
    },
    onSuccess: (data: LoginResponse) => {
      if (data) {
        // Store auth data in the store
        login(data);

        // Also store in secure storage for persistence
        setStorageItem("access_token", data.access_token);
        setStorageItem("refresh_token", data.refresh_token);
        if (data.userInfo) {
          setStorageItem("user", JSON.stringify(data.userInfo));
        }
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};
