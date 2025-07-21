import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useMusicData } from "@/store/music-data";
import MusicList from "@/components/MusicList";
import Playing from "@/components/Playing";
import { useMusicControls } from "@/store/music-controls";
import { useMusicView } from "@/store/music-view";
import PlayingMini from "@/components/PlayingMini";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link } from "expo-router";

const HomePage = () => {
  const { playerView, setPlayerView, setAppModalView } = useMusicView();
  const { data, albumsData, artistsData } = useMusicData();

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
              <Link href="/search-modal">
                <Ionicons name="search-outline" size={24} color="white" />
              </Link>
              <TouchableOpacity>
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

          <View className="h-20 w-full  rounded-md flex flex-row items-center px-4 gap-2">
            <View className="w-12 h-12 rounded-full bg-red-900/90"></View>
            <View className="flex flex-col">
              <Text className="text-white font-light">USER NAME</Text>
              <Text className="text-white text-2xl font-semibold">
                Speed dial
              </Text>
            </View>
          </View>

          <View className="mt-10 px-4 grid grid-cols-3 grid-rows-3">
            <TouchableOpacity></TouchableOpacity>
          </View>

          <View className="mt-10 px-4 flex flex-col gap-4">
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
                <Link
                  href="/artist-profile"
                  // onPress={() => {
                  //   setCurrentArtist(artistsData[1]);
                  // }}
                >
                  <Entypo name="chevron-thin-right" size={15} color="white" />
                </Link>
              </View>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {filteredAlbums.map((album, idx) => (
                <View key={idx} className="mr-4">
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
                    Album . {album.artist?.name}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {playerView === "minimized" && (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                setPlayerView("full");
              }}
              className="w-full absolute bottom-0"
              // style={[{ transform: [{ translateY }] }]}
            >
              <PlayingMini position="bottom" background="default" />
            </TouchableOpacity>
          )}
        </SafeAreaView>
      </LinearGradient>
    </>
  );
};

export default HomePage;
