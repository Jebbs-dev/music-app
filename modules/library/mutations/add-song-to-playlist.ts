import api from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { SongData } from "../../music/types/types";

export const useAddSongToPlaylist = (songId: string) => {
  return useMutation({
    mutationFn: async (playlistId: string) => {
      const response = await api.post(
        `playlists/${playlistId}/songs/${songId}`
      );
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Success", "Song added to playlist successfully!");
    },
    onError: (error) => {
      console.error("Error adding song to playlist:", error);
    },
  });
};

