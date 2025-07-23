import {
  View,
  Text,
  SafeAreaView,
  Image,
  ImageBackground,
  Button,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import React from "react";
import { Artist, SongData } from "@/modules/music/types/types";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import Animated, { FadeIn, SlideInRight } from "react-native-reanimated";
import { useMusicData } from "@/store/music-data";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import RoundedButton from "@/components/rounded-button";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { chunkIntoRows } from "@/utils/chunk-into-rows";

const ArtistProfile = () => {
  const isPresented = router.canGoBack();

  const MAX_ROWS = 4;

  const { currentArtist } = useMusicData();

  const rows = chunkIntoRows(currentArtist.songs, MAX_ROWS);

  const image = { uri: String(currentArtist.image) };

  const getYear = (date: string) => {
    const year = new Date(date).getFullYear();

    return year;
  };

  const singles = currentArtist?.songs?.filter((song) => song.albumId === null);

  return (
    // <Animated.View
    //   entering={FadeIn}
    // >
    // <LinearGradient
    //   colors={["#181818", "#000000"]}
    //   start={{ x: 0, y: 0 }}
    //   end={{ x: 1, y: 1 }}
    //   // style={{ flex: 1 }}
    // >
    <View className="h-full">
      <LinearGradient
        colors={["transparent", "#181818", "#000000"]}
        style={{
          position: "absolute",
          zIndex: 99,
          height: "100%",
          width: "100%",
        }}
      >
        <SafeAreaView className="h-full" style={{ zIndex: 9999 }}>
          <View className="flex flex-row justify-between items-center mt-10 mx-7 bg-transparent">
            {isPresented && (
              <Link href="../">
                <Entypo name="chevron-thin-left" size={18} color="white" />
              </Link>
            )}
            <View className="flex flex-row gap-7">
              <SimpleLineIcons name="action-redo" size={18} color="white" />
              <Link href="/search-modal" className="hover:bg-transparent">
                <Ionicons name="search-outline" size={18} color="white" />
              </Link>
            </View>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="mt-48 mx-7 ">
              <Text className="text-4xl font-bold text-white ">
                {currentArtist.name}
              </Text>
              <Text className="text-sm text-white mt-2" numberOfLines={1}>
                {currentArtist.description}
              </Text>
            </View>

            <View className="flex flex-row justify-between items-center mt-5 mx-7 ">
              <TouchableOpacity className="px-5 py-3 bg-white rounded-full">
                <Text className="font-semibold">Subscribe</Text>
              </TouchableOpacity>

              <View className="flex flex-row items-center gap-5">
                <View>
                  <TouchableOpacity className="flex flex-row items-center gap-2 px-5 py-3 rounded-full bg-gray-600/20">
                    <Feather name="radio" size={16} color="white" />
                    <Text className="font-semibold text-white">Radio</Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <RoundedButton
                    icon="play"
                    iconType="ionicon"
                    onPress={() => {
                      console.log("play");
                    }}
                    color="black"
                    className="p-4 bg-white"
                  />
                </View>
              </View>
            </View>

            <View className="mt-10">
              <View className="flex flex-row justify-between items-center mx-7 ">
                <Text className="text-white font-semibold text-2xl">
                  Top Songs
                </Text>
                <View className="flex flex-row items-center gap-3">
                  <TouchableOpacity className="px-2 py-1 border border-gray-700 rounded-full">
                    <Text className="text-xs text-white font-semibold">
                      Play all
                    </Text>
                  </TouchableOpacity>
                  <Entypo name="chevron-thin-right" size={16} color="white" />
                </View>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex flex-col gap-4 mx-7">
                  {rows.map((row, rowIndex) => (
                    <View key={rowIndex} className="flex flex-row gap-4">
                      {row.map((item: SongData, colIndex: number) => (
                        <TouchableOpacity key={`${rowIndex}-${colIndex}`}>
                          <View className="w-[320px] flex flex-row items-center justify-between py-3">
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
                                <Text className="text-white font-semibold">
                                  {item.title}
                                </Text>
                                <View className="flex flex-row gap-3">
                                  <Text className="text-gray-300">
                                    {item.artist?.name}
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

              <View className="mt-5 mx-7">
                <View>
                  <Text className="text-white font-semibold text-2xl">
                    Albums
                  </Text>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {currentArtist.albums.map((album, idx) => (
                    <View key={idx} className="mr-4 mt-5">
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

                      <Text className="text-white text-lg font-semibold mt-2">
                        {album.title}
                      </Text>
                      <Text className="text-gray-400">
                        {album.releaseDate &&
                          getYear(String(album.releaseDate))}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>

              <View className="mt-10 mx-5">
                <View>
                  <Text className="text-white font-semibold text-2xl">
                    Singles
                  </Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {singles?.map((song, idx) => (
                      <View key={idx} className="mr-4 mt-5">
                        <View className="h-40 w-40 rounded-md bg-white/30">
                          {typeof song.coverImage === "string" ? (
                            <Image
                              source={
                                typeof song.coverImage === "string"
                                  ? { uri: song.coverImage }
                                  : song.coverImage
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

                        <Text className="text-white text-lg font-semibold mt-2">
                          {song.title}
                        </Text>
                        <Text className="text-gray-400">
                          {song.releaseDate &&
                            getYear(String(song.releaseDate))}
                        </Text>
                      </View>
                    ))}
                  </ScrollView>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
      <ImageBackground
        source={image}
        resizeMode="cover"
        className="h-80 opacity-90"
      ></ImageBackground>
    </View>
    // </LinearGradient>
    // </Animated.View>
  );
};

export default ArtistProfile;
