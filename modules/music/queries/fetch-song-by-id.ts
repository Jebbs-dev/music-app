import {
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";
import axios from "axios";

export const useFetchSongById = (songId: string) => {
  return useQuery({
    queryKey: ["song", songId],
    queryFn: async () => {
      const response = await axios.get(
        `http://192.168.0.173:8000/songs/${songId}`
      );
      return response.data;
    },
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
};
