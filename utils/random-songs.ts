import { SongData } from "@/modules/music/types/types";

export function getRandomSongsWithVariedArtists(data: SongData[], count = 20) {
  // 1. Group songs by artistId
  const byArtist = data.reduce((acc, song) => {
    const artist = String(song.artistId);
    if (!acc[artist]) acc[artist] = [];
    acc[artist].push(song);
    return acc;
  }, {} as Record<string, any[]>);

  // 2. Shuffle artistIds
  const shuffledArtists = Object.keys(byArtist).sort(() => Math.random() - 0.5);

  const selectedSongs: SongData[] = [];

  // 3. Pick 1–2 songs from each artist until we reach count
  for (const artistId of shuffledArtists) {
    const songs = byArtist[artistId];
    // Fisher-Yates shuffle for proper randomization
    const shuffledSongs = [...songs];
    for (let i = shuffledSongs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledSongs[i], shuffledSongs[j]] = [shuffledSongs[j], shuffledSongs[i]];
    }

    const howMany = Math.min(2, shuffledSongs.length);
    for (let i = 0; i < howMany && selectedSongs.length < count; i++) {
      selectedSongs.push(shuffledSongs[i]);
    }

    if (selectedSongs.length >= count) break;
  }

  return selectedSongs;
}
