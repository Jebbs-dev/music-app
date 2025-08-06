import { LibraryDataTypes } from "@/app/(home)/library";
import { Album, Artist, SongData } from "@/modules/music/types/types";
import useAuthStore from "@/store/auth-store";
import { useLibraryView } from "@/store/library-view";
import { useMusicControls } from "@/store/music-controls";
import { useMusicData } from "@/store/music-data";
import { useMusicView } from "@/store/music-view";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface GridViewProps {
  data: LibraryDataTypes[];
}

const GridView = ({ data }: GridViewProps) => {
  const { libraryOptions, setLibraryOptions } = useLibraryView();

  const { user } = useAuthStore();

  const {
    selectedSong,
    setSelectedSong,
    setCurrentArtist,
    setCurrentAlbum,
    data: AllSongs,
    librarySongs,
    libraryAlbums,
    libraryArtists,
    libraryPlaylists,
  } = useMusicData();

  const { setCurrentSong, setIsPlaying } = useMusicControls();

  const { setArtistModalVisible, setAlbumModalVisible, setPlayerView } =
    useMusicView();

  const dataToShow =
    libraryOptions === "songs"
      ? librarySongs.map((song) => ({ ...song, type: "SongData" as const }))
      : libraryOptions === "albums"
        ? libraryAlbums.map((album) => ({ ...album, type: "Album" as const }))
        : libraryOptions === "artists"
          ? libraryArtists.map((artists) => ({
              ...artists,
              type: "Artist" as const,
            }))
          : libraryOptions === "playlists"
            ? libraryPlaylists.map((playlist) => ({
                ...playlist,
                type: "Playlist" as const,
              }))
            : libraryOptions === "podcasts"
              ? []
              : [];

  const renderAutoPlaylist = () => (
    <View className="w-[48%]">
      <View className="w-full h-48 rounded-md bg-gray-200" />
      <View className="flex flex-col mt-2 gap-1">
        <Text className="text-white font-semibold">Liked Music</Text>
        <View className="flex flex-row items-center gap-2">
          <MaterialCommunityIcons name="pin" size={16} color="white" />
          <Text className="text-gray-300">Auto Playlist</Text>
        </View>
      </View>
    </View>
  );

  const renderLibraryItem = (libraryData: LibraryDataTypes) => {
    const isArtist = libraryData.type === "Artist";
    const isAlbum = libraryData.type === "Album";
    const isPlaylist = libraryData.type === "Playlist";

    return (
      <TouchableOpacity
        key={libraryData.id}
        onPress={() => {
          if (isArtist) {
            const artist: Artist = libraryData;
            setCurrentArtist(artist);
            setArtistModalVisible(true);
          }

          if (isAlbum) {
            const album: Album = libraryData;
            setCurrentAlbum(album);
            setAlbumModalVisible(true);
          }
        }}
        className="w-[48%] mb-4"
      >
        <View className="w-full">
          <View
            className={`w-full h-48 bg-gray-200 ${
              isArtist ? "rounded-full" : "rounded-md"
            }`}
          >
            <Image
              source={
                isArtist
                  ? typeof libraryData?.image === "string"
                    ? { uri: libraryData.image }
                    : libraryData?.image
                  : isAlbum
                    ? typeof libraryData?.coverImage === "string"
                      ? { uri: libraryData?.coverImage }
                      : libraryData?.coverImage
                    : isPlaylist
                      ? typeof libraryData?.coverImage === "string"
                        ? { uri: libraryData?.coverImage }
                        : libraryData?.coverImage
                      : require("@/assets/images/splash-icon.png")
              }
              alt="image"
              className={`w-full h-full ${
                isArtist
                  ? "rounded-full"
                  : isAlbum
                    ? "rounded-lg"
                    : "rounded-sm"
              }`}
            />
          </View>
          <View
            className={`flex flex-col gap-1 mt-2 ${isArtist ? "items-center" : ""}`}
          >
            <Text className="text-white font-semibold">
              {isArtist
                ? libraryData?.name
                : isAlbum
                  ? libraryData?.title
                  : isPlaylist
                    ? libraryData?.name
                    : "Unknown"}
            </Text>
            <Text className="text-gray-300">
              {isArtist ? "Artist" : isAlbum ? "Album" : libraryData.type}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderLibraryViewData = (libraryViewData: LibraryDataTypes) => {
    const isArtistView =
      libraryOptions === "artists" && libraryViewData.type === "Artist";
    const isSongView =
      libraryOptions === "songs" && libraryViewData.type === "SongData";
    const isAlbumView =
      libraryOptions === "albums" && libraryViewData.type === "Album";
    const isPlaylistView =
      libraryOptions === "playlists" && libraryViewData.type === "Playlist";

    // Replace the previous songId/filter/map logic with:
    const songData = isSongView
      ? AllSongs.find((song) => song.id === libraryViewData.id)
      : null;

    const artistName = songData?.artist?.name || "";
    return (
      <TouchableOpacity
        key={libraryViewData.id}
        onPress={() => {
          if (isSongView) {
            const song: SongData = libraryViewData;
            setCurrentSong(song);
            setSelectedSong(song);
            setIsPlaying(true);
            setPlayerView("full");
          }

          if (isArtistView) {
            const artist: Artist = libraryViewData;
            setCurrentArtist(artist);
            setArtistModalVisible(true);
          }

          if (isAlbumView) {
            const album: Album = libraryViewData;
            setCurrentAlbum(album);
            setAlbumModalVisible(true);
          }
        }}
        className="w-[48%] mb-4"
      >
        <View className="w-full">
          <View
            className={`w-full h-48 bg-gray-200 ${
              isArtistView ? "rounded-full" : "rounded-md"
            }`}
          >
            <Image
              source={
                isArtistView
                  ? typeof libraryViewData?.image === "string"
                    ? { uri: libraryViewData.image }
                    : libraryViewData?.image
                  : isAlbumView
                    ? typeof libraryViewData?.coverImage === "string"
                      ? { uri: libraryViewData.coverImage }
                      : libraryViewData?.coverImage
                    : isPlaylistView
                      ? typeof libraryViewData?.coverImage === "string"
                        ? { uri: libraryViewData.coverImage }
                        : libraryViewData?.coverImage
                      : isSongView
                        ? typeof libraryViewData?.coverImage === "string"
                          ? { uri: libraryViewData.coverImage }
                          : libraryViewData?.image
                        : require("@/assets/images/splash-icon.png")
              }
              alt="image"
              className={`w-full h-full ${
                isArtistView
                  ? "rounded-full"
                  : isSongView || isAlbumView || isPlaylistView
                    ? "rounded-lg"
                    : "rounded-sm"
              }`}
            />
          </View>
          <View
            className={`flex flex-col gap-1 mt-2 ${isArtistView ? "items-center" : ""}`}
          >
            <Text className="text-white font-semibold">
              {isArtistView || isPlaylistView
                ? libraryViewData?.name
                : isAlbumView || isSongView
                  ? libraryViewData?.title
                  : "Unknown"}
            </Text>
            <Text className="text-gray-300">
              {isArtistView
                ? "Artist"
                : isAlbumView
                  ? artistName
                  : isSongView
                    ? artistName
                    : isPlaylistView
                      ? user?.name
                      : ""}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 240 }}
      >
        <View className="flex flex-row flex-wrap gap-4 justify-start">
          {renderAutoPlaylist()}
          {libraryOptions === "overview"
            ? data.map((libraryData) => renderLibraryItem(libraryData))
            : dataToShow.map((libraryViewData) =>
                renderLibraryViewData(libraryViewData)
              )}
        </View>
      </ScrollView>
    </View>
  );
};

export default GridView;
