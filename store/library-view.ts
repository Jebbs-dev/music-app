import { create } from "zustand";

interface LibraryViewState {
  libraryDataView: "listView" | "gridView";
  setLibraryDataView: (view: "listView" | "gridView") => void;
}

export const useLibraryView = create<LibraryViewState>((set) => ({
  libraryDataView: "listView",
  setLibraryDataView: (view) => set({ libraryDataView: view }),
}));
