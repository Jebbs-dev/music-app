import { useMusicData } from "@/store/music-data";
import { API_URL } from "@/utils/api";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";

type FetchAlbumsFilters = {
  search?: string;
  // skip: number;
  take: number;
};

export const useFetchAlbums = (filters: FetchAlbumsFilters = { take: 10 }) => {
  const { setAlbumsData } = useMusicData();

  const query = useInfiniteQuery({
    queryKey: ["albums", filters],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await axios.get(`${API_URL}/albums`, {
        params: {
          skip: pageParam,
          take: filters.take,
          search: filters.search,
        },
      });

      return response.data.albums;
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
      // Flatten the pages and set albums data in the store
      const allAlbums = query.data.pages.flat();
      setAlbumsData(allAlbums);
    }
  }, [query.data]);

  return query;
};
