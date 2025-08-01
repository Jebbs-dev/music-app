import api from "@/utils/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useFetchAlbumById = (albumId: string) => {
  return useQuery({
    queryKey: ["albums", albumId],
    queryFn: async () => {
      const response = await api.get(`/albums/${albumId}`);
      return response.data;
    },
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
};
