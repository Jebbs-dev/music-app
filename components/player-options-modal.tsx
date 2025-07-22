import { useMusicControls } from "@/store/music-controls";
import { useMusicData } from "@/store/music-data";
import { formatTime } from "@/utils/time-format";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";
import React from "react";
import {
  Image,
  Modal,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import RoundedButton from "./rounded-button";

const modalOptions = [
  {
    icon: MaterialCommunityIcons,
    title: "Dismiss queue",
    color: "white",
    name: "playlist-remove",
  },
  {
    icon: Ionicons,
    title: "Start radio",
    color: "white",
    name: "radio-outline",
  },
  {
    icon: MaterialCommunityIcons,
    title: "Add to queue",
    color: "white",
    name: "playlist-music",
  },
  {
    icon: MaterialIcons,
    title: "Save to library",
    color: "white",
    name: "library-add",
  },
  { icon: Octicons, title: "Download", color: "white", name: "download" },
  { icon: MaterialIcons, title: "Go to album", color: "white", name: "album" },
  { icon: FontAwesome, title: "Go to artist", color: "white", name: "user-o" },
  {
    icon: MaterialCommunityIcons,
    title: "Pin to speed dial",
    color: "white",
    name: "pin",
  },
  {
    icon: MaterialIcons,
    title: "Report",
    color: "white",
    name: "outlined-flag",
  },
  {
    icon: Ionicons,
    title: "Quality",
    color: "white",
    name: "settings-outline",
  },
];

const PlayerOptionsModal = () => {
  const { isPlayerMenuOpen, duration, setIsPlayerMenuOpen } =
    useMusicControls();
  const { data, selectedSong, setSelectedSong } = useMusicData();

  // Drag-to-close gesture setup
  const translateY = useSharedValue(0);
  const THRESHOLD = 120;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const closeModal = () => {
    if (setIsPlayerMenuOpen) {
      setIsPlayerMenuOpen(false);
    }
    // Reset translateY after modal is closed
    setTimeout(() => {
      translateY.value = 0;
    }, 300);
  };

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) {
        translateY.value = e.translationY;
      }
    })
    .onEnd((e) => {
      if (translateY.value > THRESHOLD) {
        runOnJS(closeModal)();
        // Do not reset translateY here, let modal close from current position
      } else {
        translateY.value = withSpring(0);
      }
    });

  return (
    <Modal animationType="slide" transparent={true} visible={isPlayerMenuOpen}>
      <SafeAreaView className="mx-2">
        <GestureDetector gesture={gesture}>
          <Animated.View
            style={[
              { height: '100%', marginTop: 20, backgroundColor: '#374151', borderTopLeftRadius: 16, borderTopRightRadius: 16 },
              animatedStyle,
            ]}
          >
            <View className="border-b border-gray-300/30">
              <View
                className={`w-full h-20 flex flex-row items-center justify-between px-2 py-3
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
                    <View className="flex flex-row items-center gap-2">
                      <Text className="text-gray-300">{selectedSong.artist?.name}</Text>
                      <Entypo name="dot-single" size={12} color="white" />
                      <Text className="text-gray-300">
                        {formatTime(duration)}
                      </Text>
                    </View>
                  </View>
                </View>
                <View className="flex flex-row gap-8 mr-3">
                  <Feather name="thumbs-up" size={24} color="white" />

                  <RoundedButton
                    otherIcon={AntDesign}
                    iconType="others"
                    icon="close"
                    className=""
                    color="white"
                    onPress={() => setIsPlayerMenuOpen && setIsPlayerMenuOpen(false)}
                  />
                </View>
              </View>
            </View>
            <View className="flex flex-row justify-evenly mt-4 gap-3 mx-2">
              <View>
                <TouchableOpacity className="flex items-center justify-center bg-white/20 px-12 py-7 rounded-lg">
                  <MaterialIcons name="playlist-play" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-center mt-2 text-white">Play next</Text>
              </View>
              <View>
                <TouchableOpacity className="flex items-center justify-center bg-white/20  px-12 py-7 rounded-lg">
                  <MaterialIcons name="playlist-add" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-center mt-2 text-white">
                  Save to playlist
                </Text>
              </View>
              <View>
                <TouchableOpacity className="flex items-center justify-center bg-white/20  px-12 py-7 rounded-lg">
                  <MaterialCommunityIcons
                    name="share-outline"
                    size={24}
                    color="white"
                  />
                </TouchableOpacity>
                <Text className="text-center mt-2 text-white">Share</Text>
              </View>
            </View>

            <View className="mx-4 mt-4">
              {modalOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  className="flex flex-row justify-start items-center py-3 gap-4"
                >
                  <View className="flex items-center justify-center w-7 h-7">
                    <option.icon
                      color={option.color}
                      name={option.name as any}
                      size={20}
                    />
                  </View>
                  <Text className="text-white">{option.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </GestureDetector>
      </SafeAreaView>
    </Modal>
  );
};

export default PlayerOptionsModal;
