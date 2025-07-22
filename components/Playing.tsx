import { MusicType } from "@/modules/music/types/music";
import { useMusicControls } from "@/store/music-controls";
import { useMusicData } from "@/store/music-data";
import { formatTime } from "@/utils/time-format";
// import Slider from "@react-native-community/slider";
import { Slider } from "react-native-awesome-slider";
import { useSharedValue, withTiming } from "react-native-reanimated";

import {
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";
import React, { useEffect, useRef } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import NeumorphicButton from "./neumorphic-button";
import RoundedButton from "./rounded-button";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { useMusicView } from "@/store/music-view";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SongData } from "@/modules/music/types/types";

const Playing = () => {
  const { setSelectedSong, data } = useMusicData();
  
  const {
    isPlaying,
    setIsPlaying,
    currentSongIndex,
    setCurrentSongIndex,
    position,
    setPosition,
    duration,
    setDuration,
    isShuffleOn,
    setIsShuffleOn,
    repeatMode,
    setRepeatMode,
    setIsPlayerMenuOpen,
  } = useMusicControls();

  const {
    dynamicColor,
    setDynamicColor,
    setPlayerView,
    setOverlayView,
    setMusicViewOption,
  } = useMusicView();

  const currentSong: SongData = data[currentSongIndex];
  const audioSource = currentSong.url;
  const player = useAudioPlayer(audioSource);
  const status = useAudioPlayerStatus(player);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Shared values for the slider
  const progress = useSharedValue(0);
  const minimumValue = useSharedValue(0);
  const maximumValue = useSharedValue(1);

  useEffect(() => {
    // Configure audio mode once
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

    // Cleanup on unmount
    return () => {
      stopProgressTracking();
    };
  }, []);

  useEffect(() => {
    // Handle play/pause and song change
    if (isPlaying) {
      player.play();
      // startProgressTracking();
    } else {
      player.pause();
      stopProgressTracking();
    }

    if (data[currentSongIndex]) {
      setSelectedSong(data[currentSongIndex]);
    }

    // Reset position/duration on song change
    setPosition(0);
    setDuration(0);
  }, [isPlaying, currentSongIndex, player]);

  useEffect(() => {
    // Handle status updates (duration, position, completion)
    if (status.isLoaded) {
      if (status.duration) setDuration(status.duration);
      if (status.currentTime) setPosition(status.currentTime);
      if (status.didJustFinish) {
        if (repeatMode === "one") {
          player.seekTo(0);
          player.play();
        } else if (repeatMode === "all") {
          handleNext();
        } else {
          setIsPlaying(false);
          handleNext();
          setTimeout(() => setIsPlaying(true), 100);
        }
      }
    }
  }, [status, repeatMode]);

  useEffect(() => {
    // Update shared values for slider
    progress.value = withTiming(position, { duration: 1000 });
    maximumValue.value = withTiming(duration || 1, { duration: 1000 });
  }, [position, duration]);

  // const startProgressTracking = () => {
  //   // Progress is now handled by useAudioPlayerStatus hook
  //   // No need for manual interval tracking
  // };

  const stopProgressTracking = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  };

  const handleSeek = async (value: number) => {
    try {
      await player.seekTo(value);
      setPosition(value);
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
    <View className="h-screen">
      <View className="flex flex-row justify-between mx-7 items-center ios:mt-7 android:mt-14">
        <Entypo
          name="chevron-down"
          size={28}
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
            setIsPlayerMenuOpen!(true);
          }}
        />
      </View>
      <View className="items-center mt-10 border-2  rounded-lg border-[#2a2d2fcd] shadow-inner shadow-gray-700 mx-auto h-[300px] w-[350px]">
        <Image
          source={
            typeof currentSong.coverImage === "string"
              ? { uri: currentSong.coverImage }
              : currentSong.coverImage
          }
          alt="image"
          width={250}
          height={250}
          className="w-full h-full rounded-lg shadow-lg shadow-black"
        />
      </View>
      <View className="mt-10">
        <Text className="text-center text-4xl text-white">
          {currentSong.title}
        </Text>
        <Text className="text-center text-sm text-gray-400 font-semibold mt-1">
          {currentSong.artist?.name}
        </Text>
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
            icon="repeat-one"
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
      <View className="flex flex-row justify-between mt-20 mx-7 px-7">
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
  );
};

export default Playing;
