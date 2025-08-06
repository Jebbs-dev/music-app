import api from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { Alert } from "react-native";

// Type for creating a new playlist (only required fields)
export interface CreatePlaylistPayload {
  name: string;
  description: string;
  isPublic: boolean;
  userId: string;
}

export const useCreatePlaylist = () => {
  return useMutation({
    mutationFn: async (playlist: CreatePlaylistPayload) => {
      const response = await api.post(`playlists`, playlist);
      return response.data;
    },
  });
};
