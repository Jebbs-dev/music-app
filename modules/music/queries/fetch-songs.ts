import { useMusicControls } from "@/store/music-controls";
import { useMusicData } from "@/store/music-data";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { SongData } from "../types/types";
import { useEffect } from "react";
import { API_URL } from "@/utils/api";

type FetchSongsFilters = {
  search?: string;
  // skip: number;
  take: number;
};

export function useFetchSongs(filters: FetchSongsFilters = { take: 10 }) {
  const { setMusicData, setSelectedSong } = useMusicData();
  const { setCurrentSongIndex } = useMusicControls();

  const query = useInfiniteQuery({
    queryKey: ["songs", filters],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await axios.get(`${API_URL}/songs`, {
        params: { skip: pageParam, take: filters.take, search: filters.search },
      });
      return response.data.songs as SongData[];
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < filters.take) return undefined;
      return allPages.flat().length;
    },
    initialPageParam: 0,
    refetchOnWindowFocus: false,
  });

  // Set selected song and current index when data loads
  useEffect(() => {
    if (query.data) {
      const allSongs = query.data.pages.flat();
      setSelectedSong(allSongs[0]);
      setCurrentSongIndex(0);
      setMusicData(allSongs);
    }
  }, [query.data]);

  return query;
}
