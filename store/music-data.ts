import { create } from "zustand";
import { musicData } from "@/modules/music/data/music-data";
import { MusicType } from "@/modules/music/types/music";

interface MusicDataState {
  selectedTab: "list" | "playing";
  setSelectedTab: (tab: "list" | "playing") => void;
  data: MusicType[];
  setMusicData: (data: MusicType[]) => void;
  selectedSong: MusicType;
  setSelectedSong: (song: MusicType) => void;
}

export const useMusicData = create<MusicDataState>((set) => ({
  selectedTab: "playing",
  setSelectedTab: (tab) => set({ selectedTab: tab }),
  data: musicData,
  setMusicData: (data) => set({ data }),
  selectedSong: {
    id: "",
    title: "",
    artist: "",
    artwork: "",
    url: "",
  },
  setSelectedSong: (song) => set({ selectedSong: song }),
}));
