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
    onSuccess: (data) => {
      Alert.alert("", "Saved to Library!", [
        {
          text: "Library",
          onPress: () => router.push(`/(home)/library`),
          style: "default",
        },
      ]);
    },
    onError: (error: any) => {
      Alert.alert(
        "Failed to create playlist",
        error?.response?.data?.message ||
          "An error occurred during this action. Please try again.",
        [],
        {
          cancelable: true,
        }
      );
    },
  });
};
