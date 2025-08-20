import api from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { Album } from "../../music/types/types";
import { Alert } from "react-native";
import { useRouter } from "expo-router";

export const useAddAlbumToPlaylist = (albumId: string) => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (playlistId: string) => {
      const response = await api.post(
        `playlists/${playlistId}/albums/${albumId}`
      );
      return response.data;
    },
    onSuccess: (data) => {
      Alert.alert("", "Saved to Playlist!", [
        {
          text: "Library",
          onPress: () => router.push(`/(home)/library`),
          style: "default",
        },
      ]);
    },
    onError: (error: any) => {
      Alert.alert(
        "Failed to add album to playlist",
        error?.response?.data?.message ||
          "Error adding album to playlist. Please try again.",
        [],
        {
          cancelable: true,
        }
      );
    },
  });
};
