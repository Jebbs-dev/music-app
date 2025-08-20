import { Album, Artist, SongData } from "@/modules/music/types/types";
import { useMusicData } from "@/store/music-data";
import api from "@/utils/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const useFetchLibrary = (userId: string) => {
  const {
    setLibraryData,
    setLibraryAlbums,
    setLibrarySongs,
    setLibraryArtists,
    setLibraryPlaylists,
  } = useMusicData();

  const query = useQuery({
    queryKey: ["library", userId],
    queryFn: async () => {
      const response = await api.get(`library/user/${userId}`);
      return response.data;
    },
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (query.data) {
      const allLibraryData = query.data;

      setLibraryData(allLibraryData);
      setLibrarySongs(
        allLibraryData.songs?.map((song: SongData) => song) || []
      );
      setLibraryAlbums(
        allLibraryData.albums?.map((album: Album) => album) || []
      );
      setLibraryArtists(
        allLibraryData.artists?.map((artist: Artist) => artist) || []
      );
    }
  }, [query.data]);

  return query;
};
