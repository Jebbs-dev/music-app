import { useMusicControls } from "@/store/music-controls";
import { useMusicData } from "@/store/music-data";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { Artist } from "../types/types";

const UpNext = () => {
  const { selectedSong, setSelectedSong, artistsData } = useMusicData();

  const {
    setCurrentSong,
    setIsPlaying,
    currentPlaylist,
    currentSongIndex,
    setCurrentSongIndex,
    playlistContext,
    currentSong,
  } = useMusicControls();

  // Get songs that come after the current song in the playlist
  const upNextSongs = currentSongIndex >= 0
    ? currentPlaylist.slice(currentSongIndex + 1)
    : currentPlaylist;

  // Show next 10 songs or all remaining songs, whichever is smaller
  const displaySongs = upNextSongs.slice(0, 10);

  const handleSongPress = (song: any, index: number) => {
    // Calculate the actual index in the full playlist
    const actualIndex = currentSongIndex + 1 + index;

    setSelectedSong(song);
    setCurrentSong(song);
    setCurrentSongIndex(actualIndex);
    setIsPlaying(true);
  };

  const getContextTitle = () => {
    switch (playlistContext.type) {
      case "artist":
        return `Playing from ${playlistContext.name}`;
      case "album":
        return `Playing from ${playlistContext.name}`;
      case "all":
        return "Playing from Library";
      case "custom":
        return `Playing from ${playlistContext.name}`;
      default:
        return "Up Next";
    }
  };

  const currentArtist: Artist | undefined = artistsData.find(
    (artist) => artist.id === currentSong?.artistId
  );

  const getCurrentlyPlayingInfo = () => {
    if (!currentSong || !currentSong.id) return null;

    return (
      <View className="border-b border-gray-700 pb-4 mb-4">
        <Text className="text-gray-400 text-sm mb-2">Now Playing</Text>
        <View className="w-full h-20 flex flex-row items-center justify-between p-3 bg-orange-700/20 rounded-lg">
          <View className="flex flex-row items-center">
            <View className="w-14 h-14">
              <Image
                source={
                  typeof currentSong?.coverImage === "string"
                    ? { uri: currentSong.coverImage }
                    : currentSong.coverImage
                }
                alt="image"
                width={25}
                height={25}
                className="w-full h-full rounded"
              />
            </View>
            <View className="flex flex-col gap-1 ml-5">
              <Text className="text-white font-semibold">
                {currentSong.title}
              </Text>
              <Text className="text-gray-300">{currentArtist?.name}</Text>
            </View>
          </View>
          <View className="mr-3">
            <MaterialCommunityIcons
              name="music-note"
              size={24}
              color="#e17645"
            />
          </View>
        </View>
      </View>
    );
  };

  if (currentPlaylist.length === 0) {
    return (
      <View className="h-full flex items-center justify-center p-8">
        <Text className="text-white text-lg text-center">
          No playlist active
        </Text>
        <Text className="text-gray-400 text-center mt-2">
          Start playing a song to see what's coming up next
        </Text>
      </View>
    );
  }

  if (displaySongs.length === 0) {
    return (
      <View className="h-full p-4">
        {getCurrentlyPlayingInfo()}
        <View className="flex items-center justify-center flex-1">
          <Text className="text-white text-lg text-center">
            End of playlist
          </Text>
          <Text className="text-gray-400 text-center mt-2">
            No more songs in the queue
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="h-full">
      <FlatList
        data={displaySongs}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => handleSongPress(item, index)}>
            <View
              className={`w-full h-20 flex flex-row items-center justify-between p-3 
            ${currentSong?.id === item.id ? "bg-neutral-800/50" : ""}`}
            >
              <View className="flex flex-row items-center w-[75%]">
                <View className="w-14 h-14">
                  <Image
                    source={
                      typeof item?.coverImage === "string"
                        ? { uri: item.coverImage }
                        : item.coverImage
                    }
                    alt="image"
                    width={25}
                    height={25}
                    className="w-full h-full rounded"
                  />
                </View>
                <View className="flex flex-col gap-1 ml-5">
                  <Text className="text-white font-semibold">{item.title}</Text>
                  <Text className="text-gray-300">
                    {artistsData.find((artist) => artist.id === item.artistId)?.name}
                  </Text>
                </View>
              </View>
              <View className="mr-3 flex flex-row items-center gap-3">
                <Text className="text-gray-500 text-sm">#{index + 1}</Text>
                <MaterialCommunityIcons
                  name="drag-horizontal-variant"
                  size={24}
                  color="white"
                />
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListHeaderComponent={() => (
          <View className="p-4">
            <Text className="text-white text-xl font-bold mb-4">
              {getContextTitle()}
            </Text>
            {getCurrentlyPlayingInfo()}
            {displaySongs.length > 0 && (
              <Text className="text-gray-400 text-sm mb-2">
                Next {displaySongs.length} song
                {displaySongs.length !== 1 ? "s" : ""}
                {upNextSongs.length > displaySongs.length &&
                  ` (${upNextSongs.length - displaySongs.length} more in queue)`}
              </Text>
            )}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
};

export default UpNext;
