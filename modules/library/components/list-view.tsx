import { LibraryDataTypes } from "@/app/(home)/library";
import { Album, Artist, Playlist, SongData } from "@/modules/music/types/types";
import useAuthStore from "@/store/auth-store";
import { useLibraryView } from "@/store/library-view";
import { useMusicControls } from "@/store/music-controls";
import { useMusicData } from "@/store/music-data";
import { useMusicView } from "@/store/music-view";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { LinearGradient } from "expo-linear-gradient";
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useMusicContextActions } from "@/utils/music-context-helpers";

interface ListViewProps {
  data: LibraryDataTypes[];
}

const ListView = ({ data }: ListViewProps) => {
  const { libraryOptions, setLibraryOptions } = useLibraryView();

  const { user } = useAuthStore();

  const { selectedSong, setSelectedSong, setCurrentArtist, setCurrentAlbum } =
    useMusicData();

  const { setCurrentSong, setIsPlaying } = useMusicControls();

  const { setArtistModalVisible, setAlbumModalVisible, setPlayerView } =
    useMusicView();

  const { startCustomPlaylist } = useMusicContextActions();

  const {
    data: AllSongs,
    librarySongs,
    libraryAlbums,
    libraryArtists,
    libraryPlaylists,
  } = useMusicData();

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

  const handleCustomPlaylist = () => {
    if (librarySongs && librarySongs.length > 0) {
      startCustomPlaylist(librarySongs[0], librarySongs, "Saved Songs");
      setPlayerView("full");
    }
  };

  const renderAutoPlaylist = () => (
    <TouchableOpacity onPress={handleCustomPlaylist}>
      <View className="w-full h-20 flex flex-row items-center justify-between mb-4">
        <View className="flex flex-row items-center">
          <View className="w-14 h-14 rounded-sm">
            <LinearGradient
              colors={["#945034", "#A86523", "#5F8B4C"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                flex: 1,
                borderRadius: 2,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AntDesign name="like1" size={26} color="white" />
            </LinearGradient>
          </View>
          <View className="flex flex-col gap-1 ml-3">
            <Text className="text-white font-semibold">Liked Music</Text>
            <View className="flex flex-row items-center gap-2">
              <MaterialCommunityIcons name="pin" size={16} color="white" />
              <Text className="text-gray-300">Auto Playlist</Text>
            </View>
          </View>
        </View>
        <View>
          <Entypo
            name="dots-three-vertical"
            size={12}
            className="mr-2"
            color="white"
          />
        </View>
      </View>
    </TouchableOpacity>
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
      >
        <View className="w-full h-20 flex flex-row items-center justify-between mb-2">
          <View className="flex flex-row items-center">
            <View
              className={`w-14 h-14 bg-white ${
                isArtist
                  ? "rounded-full"
                  : isAlbum
                    ? "rounded-lg"
                    : "rounded-sm"
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
                        ? { uri: libraryData.coverImage }
                        : libraryData?.coverImage
                      : isPlaylist
                        ? typeof libraryData?.coverImage === "string"
                          ? { uri: libraryData.coverImage }
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
            <View className="flex flex-col gap-1 ml-3">
              <Text className="text-white font-semibold">
                <Text className="text-white font-semibold">
                  {isArtist
                    ? libraryData?.name
                    : isAlbum
                      ? libraryData?.title
                      : isPlaylist
                        ? libraryData.name
                        : "Unknown"}
                </Text>
              </Text>
              <Text className="text-gray-300">
                {isArtist ? "Artist" : isAlbum ? "Album" : libraryData.type}
              </Text>
            </View>
          </View>
          <View>
            <Entypo
              name="dots-three-vertical"
              size={12}
              className="mr-2"
              color="white"
            />
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
      >
        <View className="w-full h-20 flex flex-row items-center justify-between mb-2">
          <View className="flex flex-row items-center">
            <View
              className={`w-14 h-14 bg-white ${
                isArtistView
                  ? "rounded-full"
                  : isSongView || isAlbumView || isPlaylistView
                    ? "rounded-lg"
                    : "rounded-sm"
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
            <View className="flex flex-col gap-1 ml-3">
              <Text className="text-white font-semibold">
                <Text className="text-white font-semibold">
                  {isArtistView || isPlaylistView
                    ? libraryViewData?.name
                    : isAlbumView || isSongView
                      ? libraryViewData?.title
                      : "Unknown"}
                </Text>
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
          <View>
            <Entypo
              name="dots-three-vertical"
              size={12}
              className="mr-2"
              color="white"
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="flex flex-col">
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

export default ListView;
