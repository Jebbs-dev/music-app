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
}

export const useMusicControls = create<MusicControlsState>((set) => ({
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
}));
