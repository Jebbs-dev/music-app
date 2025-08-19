import { Playlist } from "@/modules/music/types/types";
import { useMusicData } from "@/store/music-data";
import api from "@/utils/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const useFetchPlaylistsByUserId = (userId: string) => {
  const { setLibraryPlaylists } = useMusicData();

  const query = useQuery({
    queryKey: ["playlists", userId],
    queryFn: async () => {
      const response = await api.get(`playlists/user/${userId}`);
      return response.data;
    },
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (query.data) {
      setLibraryPlaylists(
        query.data.map((playlist: Playlist) => playlist) || []
      );
    }
  }, [query.data]);

  return query;
};
