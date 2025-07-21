import {
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";
import axios from "axios";

export const useFetchArtistById = (artistId: string) => {
  return useQuery({
    queryKey: ["artists", artistId],
    queryFn: async () => {
      const response = await axios.get(
        `http://192.168.0.173:8000/artists/${artistId}`
      );
      return response.data;
    },
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
};
