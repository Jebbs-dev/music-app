import { View, Text, SafeAreaView, Image } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useMusicControls } from "@/store/music-controls";
import { useMusicData } from "@/store/music-data";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface PlayerMiniProps {
  position: "bottom" | "top";
  background: "default" | "player";
  backgroundColor?: string;
}

const PlayingMini = ({
  position,
  background,
  backgroundColor,
}: PlayerMiniProps) => {
  const { data, selectedSong } = useMusicData();
  const { isPlaying, setIsPlaying } = useMusicControls();

  return (
    <>
      <View
        className={`z-30 w-full h-20 flex flex-row items-center justify-between px-3 
        ${position === "bottom" ? "absolute bottom-0 " : ""}
        ${background === "default" ? "bg-neutral-800 " : backgroundColor}
          `}
      >
        <View className="flex flex-row items-center">
          <View className="w-14 h-14">
            <Image
              source={
                typeof selectedSong?.coverImage === "string"
                  ? { uri: selectedSong.coverImage }
                  : selectedSong.coverImage
              }
              alt="image"
              width={25}
              height={25}
              className="w-full h-full"
            />
          </View>
          <View className="flex flex-col gap-1 ml-5">
            <Text className="text-white font-semibold">
              {selectedSong.title}
            </Text>
            <Text className="text-gray-300">{selectedSong.artist?.name}</Text>
          </View>
        </View>
        <View className="mr-3">
          {isPlaying ? (
            <FontAwesome
              name="pause"
              size={18}
              color="white"
              onPress={() => setIsPlaying(false)}
            />
          ) : (
            <FontAwesome
              name="play"
              size={18}
              color="white"
              onPress={() => setIsPlaying(true)}
            />
          )}
        </View>
      </View>
    </>
  );
};

export default PlayingMini;
