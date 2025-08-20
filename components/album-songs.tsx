import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import RoundedButton from "@/components/rounded-button";
import Octicons from "@expo/vector-icons/Octicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useMusicData } from "@/store/music-data";
import { getYear } from "@/utils/time-format";
import { useMusicView } from "@/store/music-view";
import { useMusicControls } from "@/store/music-controls";
import { useMusicContextActions } from "@/utils/music-context-helpers";
import { Album, Artist, SongData } from "@/modules/music/types/types";
import { useAddAlbumToLibrary } from "@/modules/library/mutations/add-album-to-library";
import useAuthStore from "@/store/auth-store";
import { useLocalSearchParams, useRouter } from "expo-router";

const AlbumSongs = () => {
  const { artistsData, libraryAlbums, albumsData } = useMusicData();

  const { setSearchModalVisible } = useMusicView();

  const { currentSong, setIsPlaying } = useMusicControls();

  const { user } = useAuthStore();

  const { albumId } = useLocalSearchParams();

  const router = useRouter();

  const { startAlbumPlayback } = useMusicContextActions();

  const currentAlbum: Album | undefined = albumsData.find(
    (album) => album.id === albumId
  );

  const currentArtist: Artist | undefined = artistsData.find(
    (artist: Artist) => artist.id === currentAlbum?.artistId
  );

  const addAlbumToLibrary = useAddAlbumToLibrary(
    String(user?.id),
    String(currentAlbum?.id)
  );

  const handleAddAlbumToLibrary = async () => {
    try {
      if (currentAlbum?.id) {
        await addAlbumToLibrary.mutateAsync(currentAlbum);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const isAlbumInLibrary = libraryAlbums.some(
    (album) => album.id === currentAlbum?.id
  );

  const handlePlayAlbum = () => {
    if (currentAlbum && currentAlbum.songs && currentAlbum.songs.length > 0) {
      // Start playing the first song of the album
      const firstSong = currentAlbum.songs[0];
      startAlbumPlayback(firstSong, currentAlbum);
    }
  };

  const handleSongPress = (song: SongData) => {
    if (currentAlbum) {
      // Start playing from this song in the album context
      startAlbumPlayback(song, currentAlbum);
    }
  };

  const isCurrentSong = (songId: string) => {
    return currentSong?.id === songId;
  };

  if (!currentAlbum) {
    return (
      <LinearGradient
        colors={["#181818", "#000000"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView className="h-full flex items-center justify-center">
          <Text className="text-white text-lg">No album selected</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#181818", "#000000"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView className="h-full mx-7">
        <View className="flex flex-row justify-between mt-5 android:mt-16">
          <TouchableOpacity onPress={() => router.back()}>
            <Entypo name="chevron-thin-left" size={18} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              router.navigate(`/(home)/artists/${currentArtist?.id}`);
            }}
          >
            <View className="flex flex-col gap-1 items-center">
              <View className="flex flex-row items-center gap-2">
                <View className="items-center rounded-full w-4 h-4">
                  <Image
                    source={
                      typeof currentArtist?.image === "string"
                        ? { uri: currentArtist.image }
                        : currentArtist?.image
                    }
                    alt="image"
                    width={20}
                    height={20}
                    className="w-full h-full rounded-full"
                  />
                </View>
                <Text className="text-xs text-white">
                  {currentArtist?.name}
                </Text>
              </View>
              <Text className="text-xs text-white">
                {currentAlbum?.title} .{" "}
                {getYear(String(currentAlbum?.releaseDate))}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSearchModalVisible(true)}
            className="hover:bg-transparent"
          >
            <Ionicons name="search-outline" size={18} color="white" />
          </TouchableOpacity>
        </View>

        <View className="mt-5">
          <View className="items-center rounded-md mx-auto w-[250px] h-[250px]">
            <Image
              source={
                typeof currentAlbum?.coverImage === "string"
                  ? { uri: currentAlbum.coverImage }
                  : currentAlbum?.coverImage
              }
              alt="image"
              width={250}
              height={250}
              className="w-full h-full rounded-md"
            />
          </View>

          <View className="mt-3">
            <Text className="text-center text-3xl text-white font-bold">
              {currentAlbum?.title}
            </Text>
            <Text className="text-center text-gray-400 mt-2">
              {currentAlbum?.songs?.length || 0} songs
            </Text>
          </View>

          <View className="flex flex-row items-center justify-evenly mt-5">
            <View>
              <TouchableOpacity className="flex flex-row items-center py-4 px-5 rounded-full bg-gray-600/20">
                <Octicons name="download" size={18} color="white" />
              </TouchableOpacity>
            </View>

            <View>
              <TouchableOpacity
                className="flex flex-row items-center p-4  rounded-full bg-gray-600/20"
                onPress={handleAddAlbumToLibrary}
              >
                {isAlbumInLibrary ? (
                  <Ionicons name="checkmark-sharp" size={18} color="white" />
                ) : (
                  <MaterialIcons name="library-add" size={18} color="white" />
                )}
              </TouchableOpacity>
            </View>

            <View>
              <RoundedButton
                icon="play"
                iconType="ionicon"
                onPress={handlePlayAlbum}
                color="black"
                className="p-6 bg-white"
              />
            </View>

            <View>
              <TouchableOpacity className="flex flex-row items-center p-4 rounded-full bg-gray-600/20">
                <SimpleLineIcons name="action-redo" size={18} color="white" />
              </TouchableOpacity>
            </View>

            <View>
              <TouchableOpacity className="flex flex-row items-center p-4 rounded-full bg-gray-600/20">
                <MaterialCommunityIcons
                  name="dots-vertical"
                  size={18}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView className="mt-5">
            {currentAlbum?.songs?.map((song, index) => (
              <TouchableOpacity
                key={song.id || index}
                onPress={() => handleSongPress(song)}
              >
                <View
                  className={`flex flex-row items-center justify-between py-3 px-2 rounded-lg mb-2 ${
                    isCurrentSong(song.id)
                      ? "bg-orange-700/20"
                      : "bg-transparent"
                  }`}
                >
                  <View className="flex flex-row items-center gap-4">
                    <View className="w-12 flex items-center">
                      {isCurrentSong(song.id) ? (
                        <View className="flex items-center justify-center w-6 h-6">
                          <MaterialCommunityIcons
                            name="music-note"
                            size={16}
                            color="#e17645"
                          />
                        </View>
                      ) : (
                        <View className="w-12 h-12">
                          {song && (
                            <Image
                              source={
                                typeof song.coverImage === "string"
                                  ? { uri: song.coverImage }
                                  : song.coverImage
                              }
                              alt="image"
                              width={25}
                              height={25}
                              className="w-full h-full rounded-sm"
                            />
                          )}
                        </View>
                      )}
                    </View>

                    <View className="flex flex-col gap-1">
                      <Text
                        className={`font-semibold ${
                          isCurrentSong(song.id)
                            ? "text-orange-500"
                            : "text-white"
                        }`}
                      >
                        {song.title}
                      </Text>
                      <Text className="text-gray-400 text-sm">
                        {currentArtist?.name}
                        {(song as any).duration &&
                          ` • ${Math.floor((song as any).duration / 60)}:${String((song as any).duration % 60).padStart(2, "0")}`}
                        {/* You can add play count here if available: • {song.playCount} plays */}
                      </Text>
                    </View>
                  </View>

                  <View>
                    <TouchableOpacity
                      className="flex flex-row items-center p-2"
                      onPress={(e) => {
                        e.stopPropagation();
                        // Handle song menu options
                        console.log("Song menu for:", song.title);
                      }}
                    >
                      <MaterialCommunityIcons
                        name="dots-vertical"
                        size={18}
                        color="white"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            {(!currentAlbum?.songs || currentAlbum.songs.length === 0) && (
              <View className="flex items-center justify-center py-10">
                <Text className="text-gray-400 text-center">
                  No songs in this album
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default AlbumSongs;
