// THIS IS THE CONTAINER FOR THE MUSIC OPTIONS COMPONENT - UP-NEXT, LYRICS AND RELATED
import PlayingMini from "@/components/PlayingMini";
import { useMusicView } from "@/store/music-view";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import UpNext from "./up-next";
import Related from "./related";
import Lyrics from "./lyrics";
import { LinearGradient } from "expo-linear-gradient";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const MusicOptions = () => {
  const { musicViewOption, setMusicViewOption, overlayView, setOverlayView } =
    useMusicView();
  const slideAnim = useRef(new Animated.Value(-100)).current; // For PlayingMini
  const optionsSlideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current; // For options area, start off-screen
  const [modalVisible, setModalVisible] = useState(false);

  // Animate PlayingMini in from top
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, []);

  // Open modal and animate options area in from bottom
  useEffect(() => {
    if (overlayView === "options") {
      setModalVisible(true);
      optionsSlideAnim.setValue(SCREEN_HEIGHT);
      slideAnim.setValue(-100);
      Animated.parallel([
        Animated.timing(optionsSlideAnim, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [overlayView]);

  // Handler for closing: PlayingMini slides up, options area slides down
  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -200, // PlayingMini slides up
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(optionsSlideAnim, {
        toValue: SCREEN_HEIGHT, // Options area slides down
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
      setOverlayView("none");
      // Reset for next open
      optionsSlideAnim.setValue(SCREEN_HEIGHT);
      slideAnim.setValue(-100);
    });
  };

  return (
    <Modal
      animationType="none"
      visible={modalVisible}
      // transparent
      onRequestClose={handleClose}
    >
      <LinearGradient
        colors={["#181818", "#000000"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView className="h-full flex flex-col ">
          <Animated.View
            style={{
              transform: [{ translateY: slideAnim }],
            }}
          >
            <TouchableOpacity onPress={handleClose}>
              <PlayingMini
                position="top"
                background="player"
                backgroundColor=""
              />
            </TouchableOpacity>
          </Animated.View>

          <View className="h-full justify-end">
            <Animated.View
              style={{
                transform: [{ translateY: optionsSlideAnim }],
                width: "100%",
              }}
            >
              <View className="h-full bg-gray-100/30 rounded-t-2xl pb-8">
                <View className=" px-4 py-2 mt-5">
                  <View className="border-b border-gray-300/30 flex flex-row justify-between w-full ">
                    <TouchableOpacity
                      className={`px-8 py-4 ${musicViewOption === "up next" ? "border-b-2 border-white" : ""}`}
                      onPress={() => setMusicViewOption("up next")}
                    >
                      <Text className="text-white font-semibold">UP NEXT</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className={`px-8 py-4 ${musicViewOption === "lyrics" ? "border-b-2 border-white" : ""}`}
                      onPress={() => setMusicViewOption("lyrics")}
                    >
                      <Text className="text-white font-semibold">LYRICS</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className={`px-8 py-4 ${musicViewOption === "related" ? "border-b-2 border-white" : ""}`}
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
    </Modal>
  );
};

export default MusicOptions;
