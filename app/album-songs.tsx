import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
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

const AlbumSongs = () => {
  const { currentAlbum } = useMusicData();

  const { setSearchModalVisible, setAlbumModalVisible } = useMusicView();

  return (
    <LinearGradient
      colors={["#181818", "#000000"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      // style={{ flex: 1 }}
    >
      <SafeAreaView className="h-full mx-7">
        <View className="flex flex-row justify-between mt-5">
          <TouchableOpacity onPress={() => setAlbumModalVisible(false)}>
            <Entypo name="chevron-thin-left" size={18} color="#fff" />
          </TouchableOpacity>

          <View className="flex flex-col gap-1 items-center">
            <View className="flex flex-row items-center gap-2">
              <View className="items-center rounded-full w-4 h-4">
                <Image
                  source={
                    typeof currentAlbum.artist?.image === "string"
                      ? { uri: currentAlbum.artist?.image }
                      : currentAlbum.artist?.image
                  }
                  alt="image"
                  width={20}
                  height={20}
                  className="w-full h-full rounded-full"
                />
              </View>
              <Text className="text-xs text-white">
                {" "}
                {currentAlbum.artist?.name}
              </Text>
            </View>
            <Text className="text-xs text-white">
              {currentAlbum.title} .{" "}
              {getYear(String(currentAlbum.releaseDate))}{" "}
            </Text>
          </View>

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
                typeof currentAlbum.coverImage === "string"
                  ? { uri: currentAlbum.coverImage }
                  : currentAlbum.coverImage
              }
              alt="image"
              width={250}
              height={250}
              className="w-full h-full rounded-md"
            />
          </View>

          <View className="mt-3">
            <Text className="text-center text-3xl text-white font-bold">
              {currentAlbum.title}
            </Text>
          </View>

          <View className="flex flex-row items-center justify-evenly mt-5">
            <View>
              <TouchableOpacity className="flex flex-row items-center py-4 px-5 rounded-full bg-gray-600/20">
                <Octicons name="download" size={18} color="white" />
              </TouchableOpacity>
            </View>

            <View>
              <TouchableOpacity className="flex flex-row items-center p-4  rounded-full bg-gray-600/20">
                <MaterialIcons name="library-add" size={18} color="white" />
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

          <View className="mt-5">
            {currentAlbum.songs?.map((song, index) => (
              <View
                key={index}
                className="flex flex-row items-center justify-between"
              >
                <View className="flex flex-row items-center gap-7 mb-4">
                  <View>
                    <Text className="text-white font-semibold">
                      {song.albumPosition}
                    </Text>
                  </View>

                  <View className="flex flex-col gap-1">
                    <Text className="text-white font-semibold">
                      {song.title}
                    </Text>
                    <Text className="text-gray-400">
                      {song.artist?.name} . {"duration"} . {"plays"}
                    </Text>
                  </View>
                </View>

                <View>
                  <TouchableOpacity className="flex flex-row items-center">
                    <MaterialCommunityIcons
                      name="dots-vertical"
                      size={18}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default AlbumSongs;
