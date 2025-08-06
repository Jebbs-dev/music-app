import {
  Album,
  Artist,
  Library,
  Playlist,
  SongData,
} from "@/modules/music/types/types";
import { create } from "zustand";

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
  selectedSong: SongData | null;
  setSelectedSong: (song: SongData) => void;
  currentArtist: Artist | null;
  setCurrentArtist: (artist: Artist) => void;
  currentAlbum: Album | null;
  setCurrentAlbum: (album: Album) => void;
  libraryData: Library | null;
  setLibraryData: (library: Library) => void;
  librarySongs: SongData[];
  setLibrarySongs: (songs: SongData[]) => void;
  libraryAlbums: Album[];
  setLibraryAlbums: (albums: Album[]) => void;
  libraryArtists: Artist[];
  setLibraryArtists: (artists: Artist[]) => void;
  libraryPlaylists: Playlist[];
  setLibraryPlaylists: (playlist: Playlist[]) => void;
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
  selectedSong: null as SongData | null,
  setSelectedSong: (song) => set({ selectedSong: song }),
  currentArtist: null as Artist | null,
  setCurrentArtist: (artist) => set({ currentArtist: artist }),
  currentAlbum: null as Album | null,
  setCurrentAlbum: (album) => set({ currentAlbum: album }),
  libraryData: null as Library | null,
  setLibraryData: (library) => set({ libraryData: library }),
  librarySongs: [],
  setLibrarySongs: (songs) => set({ librarySongs: songs }),
  libraryAlbums: [],
  setLibraryAlbums: (albums) => set({ libraryAlbums: albums }),
  libraryArtists: [],
  setLibraryArtists: (artists) => set({ libraryArtists: artists }),
  libraryPlaylists: [],
  setLibraryPlaylists: (playlists) => set({ libraryPlaylists: playlists }),
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
