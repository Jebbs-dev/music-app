import { useMusicControls } from "@/store/music-controls";
import { useMusicData } from "@/store/music-data";
import { formatTime } from "@/utils/time-format";
// import Slider from "@react-native-community/slider";
import { Slider } from "react-native-awesome-slider";

import { Artist } from "@/modules/music/types/types";
import { useMusicView } from "@/store/music-view";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";
import { createAudioPlayer, setAudioModeAsync } from "expo-audio";
import { Link } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import NeumorphicButton from "./neumorphic-button";
import RoundedButton from "./rounded-button";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const Playing = () => {
  const { selectedSong, setSelectedSong, data, setCurrentArtist } =
    useMusicData();

  const {
    isPlaying,
    setIsPlaying,
    currentSongIndex,
    setCurrentSongIndex,
    currentSong,
    setCurrentSong,
    position,
    setPosition,
    duration,
    setDuration,
    isShuffleOn,
    setIsShuffleOn,
    repeatMode,
    setRepeatMode,
    setIsPlayerMenuOpen,
    setPlayer,
    player, // <-- get the global player instance
    lastPlayedSongUrl,
    setLastPlayedSongUrl,
    setIsPlaylistMenuOpen,
  } = useMusicControls();

  const {
    dynamicColor,
    setDynamicColor,
    setPlayerView,
    setOverlayView,
    setMusicViewOption,
    setArtistModalVisible,
  } = useMusicView();

  // Only create the player once, and set it in Zustand if not already set
  React.useEffect(() => {
    if (!player) {
      const newPlayer = createAudioPlayer();
      setPlayer(newPlayer);
    }
  }, [player, setPlayer]);

  // Set audio mode once
  useEffect(() => {
    const configureAudio = async () => {
      try {
        await setAudioModeAsync({
          allowsRecording: false,
          playsInSilentMode: true,
        });
      } catch (error) {
        console.log("Error configuring audio mode:", error);
      }
    };
    configureAudio();
    return () => {
      // stopProgressTracking(); // This function is no longer defined
    };
  }, []);

  // Add this ref to track the previous song URL
  // const prevSongUrl = useRef<string | undefined>(undefined); // This ref is no longer needed

  // When currentSong changes, replace the audio source
  useEffect(() => {
    if (player && currentSong?.url && lastPlayedSongUrl !== currentSong.url) {
      player.replace(currentSong.url);
      setPosition(0);
      setDuration(0);
      setLastPlayedSongUrl(currentSong.url); // update the global value
    }
  }, [player, currentSong]);

  // Play/pause effect
  useEffect(() => {
    if (!player) return;
    if (isPlaying) {
      player.play();
    } else {
      player.pause();
      // stopProgressTracking(); // This function is no longer defined
    }
    if (!currentSong) {
      setCurrentSong(data[currentSongIndex]);
    }
    if (!selectedSong) {
      setSelectedSong(data[currentSongIndex]);
    }
  }, [isPlaying, currentSongIndex, player]);

  // Remove the effect that references player.status
  // Add polling for position and duration
  useEffect(() => {
    if (!player) return;
    const interval = setInterval(() => {
      // These properties may exist on the player instance
      const currentTime =
        typeof player.currentTime === "number" && !isNaN(player.currentTime)
          ? player.currentTime
          : 0;
      const duration =
        typeof player.duration === "number" && !isNaN(player.duration)
          ? player.duration
          : 0;
      setPosition(currentTime);
      setDuration(duration);
      // Optionally, handle end of track logic if player.didJustFinish is available
    }, 500); // Poll every 500ms
    return () => clearInterval(interval);
  }, [player]);

  // Remove progress, maximumValue, and progressInterval if not essential
  // If you need slider progress, use local state or Zustand
  const progress = useSharedValue(position);
  const minimumValue = useSharedValue(0);
  const maximumValue = useSharedValue(duration || 1);
  // const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Remove or comment out the effect that used progress and maximumValue
  useEffect(() => {
    progress.value = position;
    maximumValue.value = duration || 1;
  }, [position, duration]);

  // const translateX = useRef(new Animated.Value(width)).current;

  // useEffect(() => {
  //   Animated.loop(
  //     Animated.timing(translateX, {
  //       toValue: -width,
  //       duration: 8000,
  //       useNativeDriver: true,
  //     })
  //   ).start();
  // }, []);

  // Remove stopProgressTracking if not used elsewhere
  // function stopProgressTracking() {}

  const handleSeek = async (value: number) => {
    try {
      if (player) {
        await player.seekTo(value);
        setPosition(value);
      }
    } catch (error) {
      console.log("Error seeking:", error);
    }
  };

  const getNextSongIndex = () => {
    if (isShuffleOn) {
      return Math.floor(Math.random() * data.length);
    }
    return (currentSongIndex + 1) % data.length;
  };

  const getPreviousSongIndex = () => {
    if (isShuffleOn) {
      return Math.floor(Math.random() * data.length);
    }
    return currentSongIndex === 0 ? data.length - 1 : currentSongIndex - 1;
  };

  const handleNext = () => {
    const nextIndex = getNextSongIndex();
    setCurrentSongIndex(nextIndex);

    setIsPlaying(true);
  };

  const handlePrevious = () => {
    const prevIndex = getPreviousSongIndex();
    setCurrentSongIndex(prevIndex);

    setIsPlaying(true);
  };

  const handleShuffle = () => {
    setIsShuffleOn(!isShuffleOn);
  };

  const handleRepeat = () => {
    const modes: ("none" | "one" | "all")[] = ["none", "one", "all"];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };

  return (
    <LinearGradient
      colors={["#181818", "#000000"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView className="h-full">
        <View className="h-screen">
          <View className="flex flex-row justify-between mx-7 items-center ios:mt-7 android:mt-14">
            <Entypo
              name="chevron-thin-down"
              size={18}
              color="#fff"
              onPress={() => setPlayerView("minimized")}
            />
            <Text className="text-center text-white text-sm font-semibold uppercase">
              Playing Now
            </Text>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={24}
              color="white"
              onPress={() => {
                setIsPlayerMenuOpen(true);
              }}
            />
          </View>
          <View className="items-center mt-10 border-2 rounded-lg border-[#2a2d2fcd] shadow-inner shadow-gray-700 mx-auto h-[300px] w-[350px]">
            <Image
              source={
                typeof currentSong?.coverImage === "string"
                  ? { uri: currentSong?.coverImage }
                  : currentSong?.coverImage
              }
              alt="image"
              width={250}
              height={250}
              className="w-full h-full rounded-lg shadow-lg shadow-black"
            />
          </View>
          <View className="mt-10 mx-7">
            <Text
              // style={{ transform: [{ translateX }] }}
              className="text-center text-3xl font-semibold text-white"
            >
              {currentSong.title}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setArtistModalVisible(true);
                setCurrentArtist(currentSong?.artist as Artist);
              }}
            >
              <Text className="text-center text-gray-400  mt-1">
                {currentSong?.artist?.name}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-5 pl-7 flex flex-row items-center gap-5 justify-evenly">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 16 }}
            >
              <TouchableOpacity className="flex flex-row items-center bg-stone-800 px-6 py-2 gap-3 rounded-full">
                <Feather name="thumbs-up" size={18} color="white" />
                <Text className="text-white">2.3k</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex flex-row items-center bg-stone-800 px-6 py-2 gap-3 rounded-full"
                onPress={() => {
                  setIsPlaylistMenuOpen(true);
                }}
              >
                <MaterialIcons name="playlist-add" size={18} color="white" />
                <Text className="text-white">Save</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex flex-row items-center bg-stone-800 px-6 py-2 gap-3 rounded-full">
                <Octicons name="download" size={18} color="white" />
                <Text className="text-white">Download</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          <View className="mt-10 px-7 mb-4">
            <Slider
              minimumValue={minimumValue}
              maximumValue={maximumValue}
              progress={progress}
              onSlidingComplete={(value) => {
                console.log("Slider completed at:", value);
                handleSeek(value);
              }}
              onValueChange={(value) => {
                console.log("Slider value changed to:", value);
                // Update position without seeking (for visual feedback)
                setPosition(value);
              }}
              theme={{
                minimumTrackTintColor: "#e17645",
                maximumTrackTintColor: "#4a4a4a",
                cacheTrackTintColor: "#4a4a4a",
                disableMinTrackTintColor: "#999999",
                bubbleBackgroundColor: "#ffffff",
                heartbeatColor: "#e17645",
              }}
              sliderHeight={3}
              thumbWidth={15}
              thumbTouchSize={30}
              disableTrackFollow={false}
              disableTrackPress={false}
              stepTimingOptions={{
                duration: 200,
              }}
            />
          </View>
          <View className="flex-row items-center justify-between px-7">
            <Text className="text-gray-400">{formatTime(position)}</Text>
            <Text className="text-gray-400">{formatTime(duration)}</Text>
          </View>
          <View className="flex flex-row justify-between mt-2 mx-7">
            <RoundedButton
              icon="shuffle"
              iconType="ionicon"
              onPress={() => {
                console.log("Shuffle Button Pressed");
                handleShuffle();
              }}
              className={`py-6 ${isShuffleOn ? "text-orange-700" : "hover:bg-gray-700"}`}
              color={isShuffleOn ? "#c2410c" : "#ccc"}
            />
            <RoundedButton
              icon="play-skip-back"
              iconType="ionicon"
              onPress={() => {
                console.log("Previous Button Pressed");
                handlePrevious();
              }}
              className="p-6 hover:bg-gray-700"
              color="#ccc"
            />
            <NeumorphicButton
              icon={isPlaying ? "pause" : "play"}
              onPress={() => {
                console.log("Play/Pause Button Pressed");
                setIsPlaying(!isPlaying);
              }}
              className="p-6 bg-orange-700"
            />
            <RoundedButton
              icon="play-skip-forward"
              iconType="ionicon"
              onPress={() => {
                console.log("Next Button Pressed");
                handleNext();
              }}
              className="p-6 hover:bg-gray-700"
              color="#ccc"
            />
            {repeatMode === "none" && (
              <RoundedButton
                iconType="others"
                otherIcon={MaterialIcons}
                icon="repeat"
                onPress={() => {
                  console.log("Repeat Button Pressed");
                  handleRepeat();
                }}
                className={`py-6 rounded-full`}
                color="#ccc"
              />
            )}
            {repeatMode === "one" && (
              <RoundedButton
                iconType="others"
                otherIcon={MaterialIcons}
                icon="repeat"
                onPress={() => {
                  console.log("Repeat Button Pressed");
                  handleRepeat();
                }}
                className="py-6 rounded-full"
                color="#c2410c"
              />
            )}
            {repeatMode === "all" && (
              <RoundedButton
                iconType="others"
                otherIcon={MaterialIcons}
                icon="repeat"
                onPress={() => {
                  console.log("Repeat Button Pressed");
                  handleRepeat();
                }}
                className={`py-6 rounded-full`}
                color="#c2410c"
              />
            )}
          </View>
          <View className="flex flex-row justify-between mt-12 mx-7 px-7">
            <TouchableOpacity>
              <Text
                className="text-gray-400"
                onPress={() => {
                  setMusicViewOption("up next");
                  setOverlayView("options");
                }}
              >
                UP NEXT
              </Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text
                className="text-gray-400"
                onPress={() => {
                  setMusicViewOption("lyrics");
                  setOverlayView("options");
                }}
              >
                LYRICS
              </Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text
                className="text-gray-400"
                onPress={() => {
                  setMusicViewOption("related");
                  setOverlayView("options");
                }}
              >
                RELATED
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Playing;
