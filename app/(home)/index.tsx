import { SongData } from "@/modules/music/types/types";
import useAuthStore from "@/store/auth-store";
import { useMusicControls } from "@/store/music-controls";
import { useMusicData } from "@/store/music-data";
import { useMusicView } from "@/store/music-view";
import { chunkIntoRows } from "@/utils/chunk-into-rows";
import { getRandomSongsWithVariedArtists } from "@/utils/random-songs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";

const HomePage = () => {
  const { width: screenWidth } = useWindowDimensions();

  const { logout, user } = useAuthStore();

  const {
    playerView,
    setPlayerView,
    setArtistModalVisible,
    setSearchModalVisible,
    setAlbumModalVisible,
  } = useMusicView();

  const { isPlaying, setIsPlaying, currentSong, setCurrentSong } =
    useMusicControls();

  const {
    data,
    setMusicData,
    albumsData,
    artistsData,
    setCurrentArtist,
    setCurrentAlbum,
    selectedSong,
    setSelectedSong,
  } = useMusicData();

  const filteredAlbums = albumsData.filter(
    (album) => album.artistId === artistsData[1]?.id
  );

  const categories = [
    "Podcasts",
    "Energise",
    "Feel Good",
    "Workout",
    "Relax",
    "Party",
    "Romance",
    "Focus",
    "Commute",
    "Sad",
    "Prayer",
    "Sleep",
  ];

  const [page, setPage] = useState(0);
  const totalPages = 3;

  const speedDialSongs = data.slice(0, 27);

  // Use useMemo to ensure quickPicks only loads once when data is available
  const quickPicks = useMemo(() => {
    if (data.length === 0) return [];
    return getRandomSongsWithVariedArtists(data, 20);
  }, [data.length]); // Only regenerate if data length changes (initial load)

  const MAX_ROWS = 5;

  const rows = useMemo(() => {
    return chunkIntoRows(quickPicks, MAX_ROWS);
  }, [quickPicks]);

  // const items = Array.from({ length: 27 }, (_, i) => i + 1);
  const start = page * 9;
  const currentItems = speedDialSongs.slice(start, start + 9);

  const columns = [0, 1, 2].map((colIndex) =>
    currentItems.slice(colIndex * 3, colIndex * 3 + 3)
  );

  const handleGesture = ({ nativeEvent }: any) => {
    if (nativeEvent.state === State.END) {
      const swipeThreshold = 50;

      if (nativeEvent.translationX < -swipeThreshold && page < totalPages - 1) {
        setPage((prev) => prev + 1); // Swipe left
      } else if (nativeEvent.translationX > swipeThreshold && page > 0) {
        setPage((prev) => prev - 1); // Swipe right
      }
    }
  };

  return (
    <>
      <LinearGradient
        colors={["#7A0C15", "#181818", "#000000"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        // style={{ flex: 1 }}
      >
        <SafeAreaView className="h-full">
          <View className="mt-5 w-full flex flex-row justify-between items-center px-4">
            <View>
              <Text className="text-white text-2xl">App Logo</Text>
            </View>
            <View className="flex flex-row gap-6">
              <TouchableOpacity>
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSearchModalVisible(true)}>
                <Ionicons name="search-outline" size={24} color="white" />
              </TouchableOpacity>

              <TouchableOpacity onPress={logout}>
                <FontAwesome name="circle" size={24} color="gray" />
              </TouchableOpacity>
            </View>
          </View>
          <View className="mt-5">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, padding: 16 }}
            >
              {categories.map((category, index) => (
                <View
                  key={index}
                  className="border border-gray-300/20 bg-gray-400/20 rounded-lg px-4 py-3"
                >
                  <Text className="text-white font-medium">{category}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="mt-10 flex flex-row justify-between items-center mx-7 ">
              <Text className="text-white font-semibold text-2xl">
                Quick Picks
              </Text>
              <View className="flex flex-row items-center gap-3">
                <TouchableOpacity className="px-2 py-1 border border-gray-700 rounded-full">
                  <Text className="text-xs text-white font-semibold">
                    Play all
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex flex-col gap-4 mx-7">
                {rows?.map((row, rowIndex) => (
                  <View key={rowIndex} className="flex flex-row gap-4">
                    {row?.map((item: SongData, colIndex: number) => (
                      <TouchableOpacity
                        key={`${rowIndex}-${colIndex}`}
                        onPress={() => {
                          setSelectedSong(item);
                          setCurrentSong(item);
                          setIsPlaying(true);
                          setPlayerView("full");
                        }}
                      >
                        <View className="max-w-[320px] flex flex-row items-center justify-between py-3">
                          <View className="flex flex-row items-center">
                            {item.coverImage ? (
                              <View className="w-14 h-14 rounded-md">
                                <Image
                                  source={
                                    typeof item?.coverImage === "string"
                                      ? { uri: item.coverImage }
                                      : item.coverImage
                                  }
                                  alt="image"
                                  className="w-full h-full rounded-md"
                                />
                              </View>
                            ) : (
                              <View className="w-14 h-14 bg-gray-600 rounded-md" />
                            )}
                            <View className="flex flex-col gap-1 ml-5">
                              <Text
                                className="text-white font-semibold truncate w-64"
                                numberOfLines={1}
                              >
                                {item.title}
                              </Text>
                              <View className="flex flex-row gap-3">
                                <Text className="text-gray-300">
                                  <Text>{item.artist?.name}</Text>
                                  <Entypo
                                    name="dot-single"
                                    size={18}
                                    color="gray"
                                  />{" "}
                                  Many
                                </Text>
                              </View>
                            </View>
                          </View>
                          <MaterialCommunityIcons
                            name="dots-vertical"
                            size={24}
                            color="white"
                          />
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                ))}
              </View>
            </ScrollView>

            <View className="h-20 w-full rounded-md flex flex-row items-center px-4 gap-2">
              <View className="w-12 h-12 rounded-full bg-red-900/90"></View>
              <View className="flex flex-col">
                <Text className="text-white font-light">USER NAME</Text>
                <Text className="text-white text-2xl font-semibold">
                  Speed dial
                </Text>
              </View>
            </View>

            <PanGestureHandler onHandlerStateChange={handleGesture}>
              <View className="mt-10 w-full items-center">
                <View className="px-4 mx-4 flex flex-row gap-3">
                  {columns.map((column, colIndex) => (
                    <View key={colIndex} className="gap-3 w-1/3 flex flex-col">
                      {column.map((item) => (
                        <TouchableOpacity
                          key={item.id}
                          onPress={() => {
                            setSelectedSong(item);
                            setCurrentSong(item);
                            setIsPlaying(true);
                            setPlayerView("full");
                          }}
                        >
                          {item.coverImage ? (
                            <View className="h-20 bg-white rounded-md items-center justify-center">
                              <Image
                                source={
                                  typeof item.coverImage === "string"
                                    ? { uri: item.coverImage }
                                    : item.coverImage
                                }
                                alt="image"
                                width={30}
                                height={20}
                                className="w-full h-full rounded-md"
                              />
                              <Text
                                className="mx-2 absolute bottom-0 truncate text-white"
                                numberOfLines={1}
                              >
                                {item.title}
                              </Text>
                            </View>
                          ) : (
                            <View className="h-20 bg-white rounded-md items-center justify-center"></View>
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  ))}
                </View>

                {/* Navigation Dots */}
                <View className="flex flex-row gap-2 mt-4">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <TouchableOpacity
                      key={i}
                      onPress={() => setPage(i)}
                      className={`w-2 h-2 rounded-full ${
                        i === page ? "bg-blue-500" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </View>
              </View>
            </PanGestureHandler>

            <View className="mt-16 px-4 flex flex-col gap-4">
              <View className="flex flex-row justify-between items-center">
                <View className="flex flex-row items-center gap-3">
                  <View className="h-12 w-12 rounded-full bg-white">
                    <Image
                      source={
                        typeof artistsData[1]?.image === "string"
                          ? { uri: artistsData[1]?.image }
                          : artistsData[1]?.image
                      }
                      alt="image"
                      width={25}
                      height={25}
                      className="w-full h-full rounded-full"
                    />
                  </View>
                  <Text className="text-2xl font-bold text-white">
                    {artistsData[1]?.name}
                  </Text>
                </View>
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      setArtistModalVisible(true);
                      setCurrentArtist(artistsData[1]);
                    }}
                  >
                    {/* <Link
                      href="/artist-profile"
                      onPress={() => {
                        setCurrentArtist(artistsData[1]);
                      }}
                    > */}
                    <Entypo name="chevron-thin-right" size={15} color="white" />
                    {/* </Link> */}
                  </TouchableOpacity>
                </View>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {filteredAlbums.map((album, idx) => (
                  <View key={idx} className="mr-4">
                    <TouchableOpacity
                      onPress={() => {
                        setAlbumModalVisible(true);
                        setCurrentAlbum(album);
                      }}
                    >
                      <View className="h-40 w-40 rounded-md bg-white/30">
                        {typeof album.coverImage === "string" ? (
                          <Image
                            source={
                              typeof album.coverImage === "string"
                                ? { uri: album.coverImage }
                                : album.coverImage
                            }
                            alt="image"
                            width={25}
                            height={25}
                            className="w-full h-full rounded-md"
                          />
                        ) : (
                          <View className="h-40 w-40 rounded-md bg-white/30" />
                        )}
                      </View>
                    </TouchableOpacity>

                    <Text className="text-white text-lg font-semibold mt-2 w-40">
                      {album.title}
                    </Text>
                    <Text className="text-gray-400 w-40">
                      Album . {album.artist?.name}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            <View className="mt-32"></View>
          </ScrollView>
          {playerView === "minimized" && (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                setPlayerView("full");
              }}
              className="w-full absolute bottom-0"
              // style={[{ transform: [{ translateY }] }]}
            ></TouchableOpacity>
          )}
        </SafeAreaView>
      </LinearGradient>
    </>
  );
};

export default HomePage;
