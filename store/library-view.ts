import { create } from "zustand";

export type LibraryOptionsTypes = "overview" | "songs" | "albums" | "artists" | "playlists" | "podcasts";

interface LibraryViewState {
  libraryDataView: "listView" | "gridView";
  setLibraryDataView: (view: "listView" | "gridView") => void;
  libraryOptions: LibraryOptionsTypes;
  setLibraryOptions: (
    option: LibraryOptionsTypes
  ) => void;
}

export const useLibraryView = create<LibraryViewState>((set) => ({
  libraryDataView: "listView",
  setLibraryDataView: (view) => set({ libraryDataView: view }),
  libraryOptions: "overview",
  setLibraryOptions: (option) => set({ libraryOptions: option }),
}));
