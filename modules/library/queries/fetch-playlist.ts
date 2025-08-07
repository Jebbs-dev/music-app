import api from "@/utils/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useFetchPlaylistById = (playlistId: string) => {
  const query = useQuery({
    queryKey: ["playlists", playlistId],
    queryFn: async () => {
      const response = await api.get(`playlists/${playlistId}`);
      return response.data;
    },
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  return query;
};
