import { create } from "zustand";

interface MusicViewState {
  dynamicColor: string;
  setDynamicColor: (color: string) => void;
  playerView: "full" | "minimized";
  setPlayerView: (view: "full" | "minimized") => void;
  overlayView: "player" | "options";
  setOverlayView: (view: "player" | "options") => void;
  musicViewOption: "up next" | "lyrics" | "related";
  setMusicViewOption: (viewOption: "up next" | "lyrics" | "related") => void;
}

export const useMusicView = create<MusicViewState>((set) => ({
  dynamicColor: "#7A0C15",
  setDynamicColor: (color) => set({dynamicColor: color}),
  playerView: "minimized",
  setPlayerView: (view) => set({ playerView: view }),
  overlayView: "player",
  setOverlayView: (view) => set({ overlayView: view }),
  musicViewOption: "up next",
  setMusicViewOption: (viewOption) => set({ musicViewOption: viewOption  })
}));

