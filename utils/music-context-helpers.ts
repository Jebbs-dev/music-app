import { useMusicControls } from "@/store/music-controls";
import { useMusicData } from "@/store/music-data";
import { Album, SongData } from "@/modules/music/types/types";

// Helper function to create artist radio playlist
export const createArtistRadio = (
  artistId: string,
  allSongs: SongData[]
): SongData[] => {
  const artistSongs = allSongs.filter((song) => song.artist?.id === artistId);

  return artistSongs;
};

// Helper function to create album playlist
export const createAlbumPlaylist = (album: Album): SongData[] => {
  if (!album?.songs || !Array.isArray(album.songs)) return [];
  // Sort songs by album position if available, otherwise keep original order
  return (album.songs as SongData[]).sort((a, b) => {
    const aPos = (a as any).albumPosition || 0;
    const bPos = (b as any).albumPosition || 0;
    return aPos - bPos;
  });
};

// Helper function to start artist radio
export const startArtistRadio = (song: SongData, allSongs: SongData[]) => {
  const {
    setCurrentSong,
    setCurrentPlaylist,
    setCurrentSongIndex,
    setPlaylistContext,
    setIsPlaying,
  } = useMusicControls.getState();

  const artistPlaylist = createArtistRadio(song.artist?.id || "", allSongs);
  const songIndex = artistPlaylist.findIndex((s) => s.id === song.id);

  setCurrentPlaylist(artistPlaylist);
  setCurrentSongIndex(songIndex >= 0 ? songIndex : 0);
  setPlaylistContext({
    type: "artist",
    id: song.artist?.id,
    name: song.artist?.name,
  });
  setCurrentSong(song);
  setIsPlaying(true);

  console.log(
    `Started ${song.artist?.name} Radio with ${artistPlaylist.length} songs`
  );
};

// Helper function to start album playback
export const startAlbumPlayback = (song: SongData, album: Album) => {
  const {
    setCurrentSong,
    setCurrentPlaylist,
    setCurrentSongIndex,
    setPlaylistContext,
    setIsPlaying,
  } = useMusicControls.getState();

  const albumPlaylist = createAlbumPlaylist(album);
  const songIndex = albumPlaylist.findIndex((s) => s.id === song.id);

  setCurrentPlaylist(albumPlaylist);
  setCurrentSongIndex(songIndex >= 0 ? songIndex : 0);
  setPlaylistContext({
    type: "album",
    id: album.id,
    name: album.title,
  });
  setCurrentSong(song);
  setIsPlaying(true);

  console.log(
    `Started playing ${album.title} with ${albumPlaylist.length} songs`
  );
};

// Helper function to start playing from library (all songs)
export const startLibraryPlayback = (song: SongData, allSongs: SongData[]) => {
  const {
    setCurrentSong,
    setCurrentPlaylist,
    setCurrentSongIndex,
    setPlaylistContext,
    setIsPlaying,
  } = useMusicControls.getState();

  const songIndex = allSongs.findIndex((s) => s.id === song.id);

  setCurrentPlaylist(allSongs);
  setCurrentSongIndex(songIndex >= 0 ? songIndex : 0);
  setPlaylistContext({
    type: "all",
    name: "Library",
  });
  setCurrentSong(song);
  setIsPlaying(true);

  console.log(`Started playing from library with ${allSongs.length} songs`);
};

// Helper function to start custom playlist
export const startCustomPlaylist = (
  song: SongData,
  playlist: SongData[],
  playlistName: string,
  playlistId?: string
) => {
  const {
    setCurrentSong,
    setCurrentPlaylist,
    setCurrentSongIndex,
    setPlaylistContext,
    setIsPlaying,
  } = useMusicControls.getState();

  const songIndex = playlist.findIndex((s) => s.id === song.id);

  setCurrentPlaylist(playlist);
  setCurrentSongIndex(songIndex >= 0 ? songIndex : 0);
  setPlaylistContext({
    type: "custom",
    id: playlistId,
    name: playlistName,
  });
  setCurrentSong(song);
  setIsPlaying(true);

  console.log(`Started playing ${playlistName} with ${playlist.length} songs`);
};

// Hook to get context-aware actions
export const useMusicContextActions = () => {
  const { data } = useMusicData();

  return {
    startArtistRadio: (song: SongData) => startArtistRadio(song, data),
    startAlbumPlayback: (song: SongData, album: Album) =>
      startAlbumPlayback(song, album),
    startLibraryPlayback: (song: SongData) => startLibraryPlayback(song, data),
    startCustomPlaylist: (
      song: SongData,
      playlist: SongData[],
      name: string,
      id?: string
    ) => startCustomPlaylist(song, playlist, name, id),
  };
};

export const getRecommendedContext = (
  song: SongData,
  currentView: string,
  currentAlbum?: Album,
  currentArtist?: { id: string; name: string } | null
) => {
  // If we're viewing an album, play from that album
  if (currentView === "album" && currentAlbum) {
    return { type: "album", data: currentAlbum };
  }

  // If we're viewing an artist, start artist radio
  if (currentView === "artist" && currentArtist) {
    return { type: "artist", data: currentArtist };
  }

  // Default to artist radio
  return { type: "artist", data: song.artist || null };
};
