import api from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { Album } from "../../music/types/types";
import { Alert } from "react-native";
import { router } from "expo-router";

export const useAddAlbumToLibrary = (userId: string, albumId: string) => {
  return useMutation({
    mutationFn: async (album: Album) => {
      const response = await api.post(
        `library/${userId}/album/${albumId}`,
        album
      );
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
        "Failed to add album to library",
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

// onSuccess: (data) => {
//       Alert.alert("", "Saved to Library!", [
//         {
//           text: "Library",
//           onPress: () => router.push(`/(home)/library`),
//           style: "default",
//         },
//       ]);
//     },
//     onError: (error: any) => {
//       Alert.alert(
//         "Failed to add album to library",
//         error?.response?.data?.message ||
//           "An error occurred during this action. Please try again.",
//         [],
//         {
//           cancelable: true,
//         }
//       );
//     },
