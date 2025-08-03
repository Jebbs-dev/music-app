import useAuthStore, { setStorageItem } from "@/store/auth-store";
import api from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Artist, User } from "../types/types";
import { router } from "expo-router";

interface UserAuth {
  name: string;
  email: string;
  password: string;
}


export const useSignupUser = () => {
  const {  setAuthView } = useAuthStore();

  return useMutation({
    mutationFn: async (user: UserAuth) => {
      const response = await api.post("/users", user);
      return response.data;
    },
    onSuccess: (data) => {
      if (data) {
        setAuthView("login"); 
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};
