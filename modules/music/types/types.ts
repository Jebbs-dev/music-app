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
