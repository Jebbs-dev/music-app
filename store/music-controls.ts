import { SongData } from "@/modules/music/types/types";
import { create } from "zustand";

interface MusicControlsState {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
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
  isPlayerMenuOpen?: boolean;
  setIsPlayerMenuOpen?: (isOpen: boolean) => void;
}

export const useMusicControls = create<MusicControlsState>((set) => ({
  isPlaying: false,
  setIsPlaying: (playing) => set({ isPlaying: playing }),
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
}));
