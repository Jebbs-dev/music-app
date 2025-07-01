import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useMusicView } from "@/store/music-view";
import PlayingMini from "@/components/PlayingMini";

const Library = () => {
  const { playerView, setPlayerView } = useMusicView();

  return (
    <>
      <LinearGradient
        colors={["#7A0C15", "#181818", "#000000"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        // style={{ flex: 1 }}
      >
        <SafeAreaView>
          <View className="h-full flex items-center justify-center ">
            <Text className="text-white text-4xl">Library</Text>
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

export default Library;
