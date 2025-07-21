import { Album, Artist, SongData } from "@/modules/music/types/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { create } from "zustand";
import { useMusicControls } from "./music-controls";

// Custom hook to use in components/layout for fetching and syncing with the store
import { useEffect } from "react";

interface MusicDataState {
  selectedTab: "list" | "playing";
  setSelectedTab: (tab: "list" | "playing") => void;
  data: SongData[];
  setMusicData: (data: SongData[]) => void;
  artistsData: Artist[];
  setArtistsData: (data: Artist[]) => void;
  albumsData: Album[];
  setAlbumsData: (data: Album[]) => void;
  // isLoading: boolean;
  // error: string | null;
  // fetchNextPage: () => void;
  // hasNextPage: boolean;
  // isFetchingNextPage: boolean;
  // Additional state for selected song
  selectedSong: SongData;
  setSelectedSong: (song: SongData) => void;
}

export const useMusicData = create<MusicDataState>((set, get) => ({
  selectedTab: "playing",
  setSelectedTab: (tab) => set({ selectedTab: tab }),
  data: [],
  setMusicData: (data) => {
    set({ data });
  },
  artistsData: [],
  setArtistsData: (data) => {
    set({ artistsData: data });
  },
  albumsData: [],
  setAlbumsData: (data) => {
    set({ albumsData: data });
  },
  selectedSong: {
    id: "",
    title: "",
    artist: { id: "", name: "" },
    coverImage: "",
    url: "",
  },
  setSelectedSong: (song) => set({ selectedSong: song }),
}));

// export function useMusicDataQuery(take = 10) {
//   const {
//     setSelectedTab,
//     setSelectedSong,
//   } = useMusicData.getState();
//   const { setCurrentSongIndex } = useMusicControls.getState();
//   const query = useInfiniteQuery({
//     queryKey: ["songs", take],
//     queryFn: async ({ pageParam = 0 }) => {
//       const response = await axios.get("http://192.168.0.173:8000/songs", {
//         params: { skip: pageParam, take },
//       });
//       return response.data.songs as SongData[];
//     },
//     getNextPageParam: (lastPage, allPages) => {
//       if (lastPage.length < take) return undefined;
//       return allPages.flat().length;
//     },
//     initialPageParam: 0,
//     refetchOnWindowFocus: false,
//   });

//   // Sync query state with zustand store
//   useEffect(() => {
//     useMusicData.setState({
//       isLoading: query.isLoading || query.isFetching,
//       error: query.error ? (query.error as Error).message : null,
//       data: query.data ? query.data.pages.flat() : [],
//       fetchNextPage: query.fetchNextPage,
//       hasNextPage: query.hasNextPage,
//       isFetchingNextPage: query.isFetchingNextPage,
//     });
//     // Set selected song and current index when data loads
//     if (query.data && query.data.pages.flat().length > 0) {
//       useMusicData.setState({ selectedSong: query.data.pages.flat()[0] });
//       setCurrentSongIndex(0);
//     }
//   }, [query.isLoading, query.isFetching, query.data, query.error, query.hasNextPage, query.isFetchingNextPage]);

//   return query;
// }
