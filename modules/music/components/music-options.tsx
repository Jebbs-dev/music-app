// THIS IS THE CONTAINER FOR THE MUSIC OPTIONS COMPONENT - UP-NEXT, LYRICS AND RELATED
import PlayingMini from "@/components/PlayingMini";
import { useMusicView } from "@/store/music-view";
import React, { useEffect } from "react";
import {
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import UpNext from "./up-next";
import Related from "./related";
import Lyrics from "./lyrics";
import { LinearGradient } from "expo-linear-gradient";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const MusicOptions = () => {
  const { musicViewOption, setMusicViewOption, overlayView, setOverlayView } =
    useMusicView();
  
  const animationProgress = useSharedValue(0); // 0 = closed, 1 = open
  const playingMiniTranslateY = useSharedValue(-100);
  const optionsTranslateY = useSharedValue(SCREEN_HEIGHT);

  useEffect(() => {
    if (overlayView === "options") {
      // Reset positions
      playingMiniTranslateY.value = -100;
      optionsTranslateY.value = SCREEN_HEIGHT;
      
      // Animate in
      animationProgress.value = withTiming(1, { duration: 350 });
      playingMiniTranslateY.value = withTiming(0, { duration: 350 });
      optionsTranslateY.value = withTiming(0, { duration: 350 });
    }
  }, [overlayView, animationProgress, playingMiniTranslateY, optionsTranslateY]);

  const handleClose = () => {
    playingMiniTranslateY.value = withTiming(-200, { duration: 350 });
    optionsTranslateY.value = withTiming(
      SCREEN_HEIGHT, 
      { duration: 350 },
      (finished) => {
        'worklet';
        if (finished) {
          animationProgress.value = withTiming(
            0, 
            { duration: 200 },
            (containerFinished) => {
              'worklet';
              if (containerFinished) {
                runOnJS(setOverlayView)("none");
              }
            }
          );
        }
      }
    );
  };

  const handleBackdropPress = () => {
    handleClose();
  };

  const backdropAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animationProgress.value,
      [0, 1],
      [0, 0.8],
      Extrapolate.CLAMP
    );
    
    return {
      opacity,
      backgroundColor: 'black',
    };
  });

  const containerAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      animationProgress.value,
      [0, 1],
      [0.95, 1],
      Extrapolate.CLAMP
    );
    
    return {
      transform: [{ scale }],
    };
  });

  const playingMiniAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: playingMiniTranslateY.value }],
    };
  });

  const optionsAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: optionsTranslateY.value }],
      width: "100%",
    };
  });

  if (overlayView !== "options") {
    return null;
  }

  return (
    <Animated.View 
      className="absolute top-0 left-0 right-0 bottom-0 z-50"
      style={containerAnimatedStyle}
    >
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <Animated.View 
          className="absolute top-0 left-0 right-0 bottom-0"
          style={backdropAnimatedStyle}
        />
      </TouchableWithoutFeedback>

      {/* Modal Content */}
      <LinearGradient
        colors={["#181818", "#000000"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1"
      >
        <SafeAreaView className="h-full flex flex-col android:mt-10">
          <Animated.View style={playingMiniAnimatedStyle}>
            <TouchableOpacity onPress={handleClose}>
              <PlayingMini
                position="top"
                background="player"
                backgroundColor=""
              />
            </TouchableOpacity>
          </Animated.View>

          <View className="h-full justify-end">
            <Animated.View style={optionsAnimatedStyle}>
              <View className="h-full bg-gray-100/30 rounded-t-2xl pb-8">
                <View className="px-4 py-2 mt-5">
                  <View className="border-b border-gray-300/30 flex flex-row justify-between w-full">
                    <TouchableOpacity
                      className={`px-8 py-4 ${
                        musicViewOption === "up next"
                          ? "border-b-2 border-white"
                          : ""
                      }`}
                      onPress={() => setMusicViewOption("up next")}
                    >
                      <Text className="text-white font-semibold">UP NEXT</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className={`px-8 py-4 ${
                        musicViewOption === "lyrics"
                          ? "border-b-2 border-white"
                          : ""
                      }`}
                      onPress={() => setMusicViewOption("lyrics")}
                    >
                      <Text className="text-white font-semibold">LYRICS</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className={`px-8 py-4 ${
                        musicViewOption === "related"
                          ? "border-b-2 border-white"
                          : ""
                      }`}
                      onPress={() => setMusicViewOption("related")}
                    >
                      <Text className="text-white font-semibold">RELATED</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {musicViewOption === "up next" && <UpNext />}
                {musicViewOption === "lyrics" && <Lyrics />}
                {musicViewOption === "related" && <Related />}
              </View>
            </Animated.View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </Animated.View>
  );
};

export default MusicOptions;