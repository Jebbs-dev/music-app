import { useMusicData } from "@/store/music-data";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { Artist } from "../types/types";
import { useEffect } from "react";
import { API_URL } from "@/utils/api";

type FetchArtistsFilters = {
  search?: string;
  // skip: number;
  take: number;
};

export const useFetchArtists = (filters: FetchArtistsFilters = { take: 10 }) => {
  const { setArtistsData } = useMusicData();

  const query =  useInfiniteQuery({
    queryKey: ["artists", filters.take],
    queryFn: async ({ pageParam = 0 }) => {

      const response = await axios.get(`${API_URL}/artists`, {
        params: {
          skip: pageParam,
          take: filters.take,
          search: filters.search,
        },
      });
      return response.data.artists as Artist[];
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

  useEffect(() => {
    if (query.data) {
      const allArtists = query.data.pages.flat();
      setArtistsData(allArtists);
    }
  }, [query.data]);

  return query;

};
