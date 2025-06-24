import Playing from "@/components/Playing";
import PlayingMini from "@/components/PlayingMini";
import { useMusicData } from "@/store/music-data";
import { useMusicView } from "@/store/music-view";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const Explore = () => {
  const { data, selectedSong } = useMusicData();
  const { playerView, setPlayerView } = useMusicView();
  const animatedValue = useRef(new Animated.Value(0)).current; // 0: minimized, 1: full

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: playerView === "minimized" ? 1 : 0,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [playerView]);

  // Interpolate translateY for the overlay
  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_HEIGHT - 100, 0], // 100 = height of mini player
    extrapolate: "clamp",
  });

  return (
    <>
      <LinearGradient
        colors={["#7A0C15", "#181818", "#000000"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView>
          <View className="h-full">
            <Text className="text-white text-4xl">Explore</Text>
            {playerView === "minimized" && (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  setPlayerView("full")
                  
                }}
                className="w-full absolute bottom-0"
                style={[{ transform: [{ translateY }] }]}
              >
                <PlayingMini position="bottom" background="default" />
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </LinearGradient>
      {/* Overlay Player */}
    </>
  );
};

export default Explore;
