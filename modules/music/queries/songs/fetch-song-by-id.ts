import api from "@/utils/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";


export const useFetchSongById = (songId: string) => {
  return useQuery({
    queryKey: ["song", songId],
    queryFn: async () => {
      const response = await api.get(`/songs/${songId}`);
      return response.data;
    },
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
};
