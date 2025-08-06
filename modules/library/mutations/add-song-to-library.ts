import api from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { SongData } from "../../music/types/types";
import { Alert } from "react-native";
import { router } from "expo-router";
import { useMusicView } from "@/store/music-view";

export const useAddSongToLibrary = (userId: string, songId: string) => {
  const { setPlayerView } = useMusicView();

  return useMutation({
    mutationFn: async (song: SongData) => {
      const response = await api.post(`library/${userId}/song/${songId}`, song);
      return response.data;
    },
    onSuccess: (data) => {
      Alert.alert("", "Saved to Library!", [
        {
          text: "Library",
          onPress: () => {
            router.push(`/(home)/library`);
            setPlayerView("minimized");
          },
          style: "default",
        },
      ]);
    },
    onError: (error: any) => {
      Alert.alert(
        "Failed to add song to library",
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
