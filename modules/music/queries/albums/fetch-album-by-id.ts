import {
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";
import axios from "axios";

export const useFetchAlbumById = (albumId: string) => {
  return useQuery({
    queryKey: ["albums", albumId],
    queryFn: async () => {
      const response = await axios.get(
        `http://192.168.0.173:8000/albums/${albumId}`
      );
      return response.data;
    },
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
};
