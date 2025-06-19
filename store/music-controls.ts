import { create } from "zustand";

interface MusicControlsState {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  sound: any; 
  setSound: (sound: any) => void;
  currentSongIndex: number;
  setCurrentSongIndex: (index: number) => void;
  position: number;
  setPosition: (position: number) => void;
  duration: number;
  setDuration: (duration: number) => void;
  isShuffleOn: boolean;
  setIsShuffleOn: (shuffle: boolean) => void;
  repeatMode: "none" | "one" | "all";
  setRepeatMode: (mode: "none" | "one" | "all") => void;
}

export const useMusicControls = create<MusicControlsState>((set) => ({
  isPlaying: false,
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  sound: null,
  setSound: (sound) => set({ sound }),
  currentSongIndex: 0,
  setCurrentSongIndex: (index) => set({ currentSongIndex: index }),
  position: 0,
  setPosition: (position) => set({ position }),
  duration: 0,
  setDuration: (duration) => set({ duration }),
  isShuffleOn: false,
  setIsShuffleOn: (shuffle) => set({ isShuffleOn: shuffle }),
  repeatMode: "none",
  setRepeatMode: (mode) => set({ repeatMode: mode }),
}));
