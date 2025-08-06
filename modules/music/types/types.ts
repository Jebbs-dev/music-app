export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

export type Artist = {
  [x: string]: any;
  id: string;
  name: string;
  email?: string;
  description?: string;
  image?: string;
  status?: "ACTIVE" | "INACTIVE";
  createdAt?: string;
  updatedAt?: string;
  albums?: Album[];
  songs?: SongData[];
};

export type Album = {
  [x: string]: any;
  id: string;
  title: string;
  artistId?: string;
  coverImage: string;
  releaseDate?: string;
  createdAt?: string;
  updatedAt?: string;
  artist?: Artist;
  songs?: SongData[];
};

export type SongData = {
  [x: string]: any;
  id: string;
  title: string;
  artistId?: string;
  albumId?: string;
  coverImage: string;
  url: string;
  releaseDate?: number;
  albumPosition?: number;
  duration?: number;
  createdAt?: string;
  updatedAt?: string;
  artist: Artist;
  albums?: Album[];
};

export type Playlist = {
  id: string;
  name: string;
  coverImage?: string;
  description?: string;
  userId: string;
  libraryId: string;
  songs?: SongData[];
  albums?: Album[];
  isPublic: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type Library = {
  id: string;
  userId: string;
  playlists?: Playlist[];
  albums?: Album[];
  songs?: SongData[];
  artists?: Artist[];
  createdAt?: string;
  updatedAt?: string;
};
