import { useMusicControls } from "@/store/music-controls";
import { useMusicData } from "@/store/music-data";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { Image, Text, View } from "react-native";

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
  const { player, isPlaying, setIsPlaying, currentSong } = useMusicControls();

  return (
    <>
      <View
        className={`z-[9999] w-full h-20 flex flex-row items-center justify-between px-3 
        ${position === "bottom" ? "absolute bottom-[83px]" : ""}
        ${background === "default" ? "bg-neutral-800 " : backgroundColor}
          `}
      >
        <View className="flex flex-row items-center w-[80%]">
          <View className="w-14 h-14">
            {currentSong && (
              <Image
                source={
                  typeof currentSong.coverImage === "string"
                    ? { uri: currentSong.coverImage }
                    : currentSong.coverImage
                }
                alt="image"
                width={25}
                height={25}
                className="w-full h-full"
              />
            )}
          </View>
          <View className="flex flex-col gap-1 ml-5">
            <Text className="text-white font-semibold">
              {currentSong && currentSong.title}
            </Text>
            <Text className="text-gray-300">
              {currentSong && currentSong.artist?.name}
            </Text>
          </View>
        </View>
        <View className="mr-3">
          <FontAwesome
            name={isPlaying ? "pause" : "play"}
            size={18}
            color="white"
            onPress={() => {
              if (isPlaying) {
                player?.pause();
                setIsPlaying(false);
              } else {
                player?.play();
                setIsPlaying(true);
              }
            }}
          />
        </View>
      </View>
    </>
  );
};

export default PlayingMini;
