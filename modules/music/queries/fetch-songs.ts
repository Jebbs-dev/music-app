import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

type FetchSongsFilters = {
  search?: string;
  // skip: number;
  take: number;
};

export const useFetchSongs = (filters: FetchSongsFilters = { take: 10 }) => {
  return useInfiniteQuery({
    queryKey: ["songs", filters.take],
    queryFn: async ({ pageParam = 0 }) => {
      console.log("fetching songs");

      const response = await axios.get("http://192.168.0.173:8000/songs", {
        params: {
          skip: pageParam,
          take: filters.take,
          search: filters.search,
        },
      });
      return response.data.songs;
    },
    getNextPageParam: (lastPage, allPages) => {
      // If the last page had fewer songs than expected, there's nothing more to load
      if (lastPage.length < (filters.take ?? 10)) return undefined;
      return allPages.flat().length; // Next `skip` value
    },
    initialPageParam: 0,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
};
