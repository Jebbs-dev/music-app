import { SongData } from "@/modules/music/types/types";
import { AudioPlayer } from "expo-audio";
import { create } from "zustand";

interface MusicControlsState {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  player: AudioPlayer | null; // Use AudioPlayer type from expo-audio
  setPlayer: (player: AudioPlayer) => void;
  lastPlayedSongUrl: string | undefined;
  setLastPlayedSongUrl: (url: string) => void;
  sound: any;
  setSound: (sound: any) => void;
  currentSongIndex: number;
  setCurrentSongIndex: (index: number) => void;
  currentSong: SongData; // Optional current song
  setCurrentSong: (song: SongData) => void;
  position: number;
  setPosition: (position: number) => void;
  duration: number;
  setDuration: (duration: number) => void;
  isShuffleOn: boolean;
  setIsShuffleOn: (shuffle: boolean) => void;
  repeatMode: "none" | "one" | "all";
  setRepeatMode: (mode: "none" | "one" | "all") => void;
  isPlayerMenuOpen: boolean;
  setIsPlayerMenuOpen: (isOpen: boolean) => void;
  isPlaylistMenuOpen: boolean;
  setIsPlaylistMenuOpen: (isOpen: boolean) => void;
  isPlaylistCreateModalOpen: boolean;
  setIsPlaylistCreateModalOpen: (isOpen: boolean) => void;

  currentPlaylist: SongData[];
  setCurrentPlaylist: (playlist: SongData[]) => void;
  playlistContext: {
    type: "all" | "artist" | "album" | "custom";
    id?: string;
    name?: string;
  };
  setPlaylistContext: (context: {
    type: "all" | "artist" | "album" | "custom";
    id?: string;
    name?: string;
  }) => void;

  // New navigation actions
  playNext: () => void;
  playPrevious: () => void;
  shuffle: () => void;
}

export const useMusicControls = create<MusicControlsState>((set, get) => ({
  isPlaying: false,
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  player: null,
  setPlayer: (player) => set({ player }),
  lastPlayedSongUrl: undefined,
  setLastPlayedSongUrl: (url: string) => set({ lastPlayedSongUrl: url }),
  sound: null,
  setSound: (sound) => set({ sound }),
  currentSongIndex: 0,
  setCurrentSongIndex: (index) => set({ currentSongIndex: index }),
  currentSong: {} as SongData, // Initialize with an empty object
  setCurrentSong: (song) => set({ currentSong: song }),
  position: 0,
  setPosition: (position) => set({ position }),
  duration: 0,
  setDuration: (duration) => set({ duration }),
  isShuffleOn: false,
  setIsShuffleOn: (shuffle) => set({ isShuffleOn: shuffle }),
  repeatMode: "none",
  setRepeatMode: (mode) => set({ repeatMode: mode }),
  isPlayerMenuOpen: false,
  setIsPlayerMenuOpen: (isOpen) => set({ isPlayerMenuOpen: isOpen }),
  isPlaylistMenuOpen: false,
  setIsPlaylistMenuOpen: (isOpen) => set({ isPlaylistMenuOpen: isOpen }),
  isPlaylistCreateModalOpen: false,
  setIsPlaylistCreateModalOpen: (isOpen) =>
    set({ isPlaylistCreateModalOpen: isOpen }),

  currentPlaylist: [],
  setCurrentPlaylist: (playlist) => set({ currentPlaylist: playlist }),
  playlistContext: { type: "all" },
  setPlaylistContext: (context) => set({ playlistContext: context }),

  playNext: () => {
    const {
      currentPlaylist,
      currentSongIndex,
      isShuffleOn,
      repeatMode,
      setCurrentSongIndex,
      setCurrentSong,
      setIsPlaying,
    } = get();

    if (currentPlaylist.length === 0) return;

    let nextIndex: number;

    if (repeatMode === "one") {
      // Stay on the same song
      nextIndex = currentSongIndex;
    } else if (isShuffleOn) {
      // Random song from playlist
      nextIndex = Math.floor(Math.random() * currentPlaylist.length);
    } else {
      // Next song in order
      nextIndex = currentSongIndex + 1;

      // Handle end of playlist
      if (nextIndex >= currentPlaylist.length) {
        if (repeatMode === "all") {
          nextIndex = 0; // Loop back to start
        } else {
          return; // Stop playing
        }
      }
    }

    setCurrentSongIndex(nextIndex);
    setCurrentSong(currentPlaylist[nextIndex]);
    setIsPlaying(true);
  },
  playPrevious: () => {
    const {
      currentPlaylist,
      currentSongIndex,
      isShuffleOn,
      setCurrentSongIndex,
      setCurrentSong,
      setIsPlaying,
    } = get();

    if (currentPlaylist.length === 0) return;

    let prevIndex: number;

    if (isShuffleOn) {
      // Random song from playlist
      prevIndex = Math.floor(Math.random() * currentPlaylist.length);
    } else {
      // Previous song in order
      prevIndex = currentSongIndex - 1;

      // Handle beginning of playlist
      if (prevIndex < 0) {
        prevIndex = currentPlaylist.length - 1; // Loop to end
      }
    }

    setCurrentSongIndex(prevIndex);
    setCurrentSong(currentPlaylist[prevIndex]);
    setIsPlaying(true);
  },

  shuffle: () => {
    const { isShuffleOn, setIsShuffleOn } = get();
    setIsShuffleOn(!isShuffleOn);
  },
}));


// Helper function to create playlists
export const createPlaylistFromContext = (
  allSongs: SongData[],
  contextType: 'all' | 'artist' | 'album' | 'custom',
  contextId?: string
): SongData[] => {
  switch (contextType) {
    case 'artist':
      return allSongs.filter(song => song.artist?.id === contextId);
    case 'album':
      return allSongs.filter(song => song.albumId === contextId);
    case 'all':
    default:
      return allSongs;
  }
};

export const startPlayingWithContext = (
  song: SongData,
  allSongs: SongData[],
  contextType: 'all' | 'artist' | 'album' | 'custom',
  contextId?: string,
  contextName?: string
) => {
  const playlist = createPlaylistFromContext(allSongs, contextType, contextId);
  const songIndex = playlist.findIndex(s => s.id === song.id);
  
  const { 
    setCurrentSong, 
    setCurrentPlaylist, 
    setCurrentSongIndex,
    setPlaylistContext, 
    setIsPlaying 
  } = useMusicControls.getState();
  
  setCurrentPlaylist(playlist);
  setCurrentSongIndex(songIndex >= 0 ? songIndex : 0);
  setPlaylistContext({ type: contextType, id: contextId, name: contextName });
  setCurrentSong(song);
  setIsPlaying(true);
};