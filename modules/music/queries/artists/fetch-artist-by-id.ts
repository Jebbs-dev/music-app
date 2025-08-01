import api from "@/utils/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useFetchArtistById = (artistId: string) => {
  return useQuery({
    queryKey: ["artists", artistId],
    queryFn: async () => {
      const response = await api.get(`/artists/${artistId}`);
      return response.data;
    },
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
};
