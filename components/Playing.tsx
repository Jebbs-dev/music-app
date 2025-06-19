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
import { Image, Text, View } from "react-native";
import NeumorphicButton from "./neumorphic-button";
import RoundedButton from "./rounded-button";

const Playing = () => {
  const { selectedTab, setSelectedTab, selectedSong, data } = useMusicData();
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
  } = useMusicControls();

  const currentSong: MusicType = data[currentSongIndex];
  const audioSource = currentSong.url;
  const player = useAudioPlayer(audioSource);
  const status = useAudioPlayerStatus(player);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Shared values for the slider
  const progress = useSharedValue(0);
  const minimumValue = useSharedValue(0);
  const maximumValue = useSharedValue(1);

  // Configure audio mode for playback
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
  }, []);

  // Update selected song when current song index changes
  useEffect(() => {
    if (currentSong && currentSong.id !== selectedSong.id) {
      // This would need to be handled in the store, but for now we'll use the current song
    }
  }, [currentSongIndex, currentSong, selectedSong]);

  // Handle play/pause
  useEffect(() => {
    if (isPlaying) {
      player.play();
      // startProgressTracking();
    } else {
      player.pause();
      stopProgressTracking();
    }
  }, [isPlaying, player]);

  // Handle song change
  useEffect(() => {
    stopProgressTracking();
    setPosition(0);
    setDuration(0);

      setTimeout(() => {
        setIsPlaying(true); 
        player.play();
      }, 100);
  }, [currentSongIndex]);

  // Get duration when audio loads
  useEffect(() => {
    if (status.isLoaded && status.duration) {
      setDuration(status.duration);
    }
  }, [status.duration]);

  // Update position from status
  useEffect(() => {
    if (status.isLoaded && status.currentTime) {
      setPosition(status.currentTime);
    }
  }, [status.currentTime]);

  // Handle completion
  useEffect(() => {
    if (status.isLoaded && status.didJustFinish) {
      if (repeatMode === "one") {
        // Repeat current song
        player.seekTo(0);
        player.play();
      } else if (repeatMode === "all") {
        // Go to next song
        handleNext();
      } else {
        // Stop playing
        setIsPlaying(false);
        handleNext();
        setTimeout(() => {
          setIsPlaying(true);
        }, 100); // Small delay to ensure the next song starts playing
      }
    }
  }, [status.didJustFinish, repeatMode]);

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
  };

  const handlePrevious = () => {
    const prevIndex = getPreviousSongIndex();
    setCurrentSongIndex(prevIndex);
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopProgressTracking();
    };
  }, []);

  // Update shared values when position and duration change
  useEffect(() => {
    progress.value = withTiming(position, {
      duration: 1000,
    });
  }, [position]);

  useEffect(() => {
    maximumValue.value = withTiming(duration || 1, {
      duration: 1000,
    });
  }, [duration]);

  return (
    <View className="h-full">
      <View className="flex flex-row justify-between mx-7 items-center ios:mt-7 android:mt-14">
        <NeumorphicButton
          icon="arrow-back"
          onPress={() => setSelectedTab("list")}
          className="p-4"
        />
        <Text className="text-center text-white text-sm font-semibold uppercase">
          Playing Now
        </Text>
        <NeumorphicButton
          icon="menu"
          onPress={() => setSelectedTab("list")}
          className="p-4"
        />
      </View>
      <View className="items-center mt-10 border-2  rounded-lg border-[#2a2d2fcd] shadow-inner shadow-gray-700 mx-auto h-[300px] w-[350px]">
        <Image
          source={
            typeof currentSong.artwork === "string"
              ? { uri: currentSong.artwork }
              : currentSong.artwork
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
          {currentSong.artist}
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
            heartbeatColor: "#e17645"
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
          onPress={() => {
            console.log("Shuffle Button Pressed");
            handleShuffle();
          }}
          className={`py-6 ${isShuffleOn ? "bg-orange-700" : "hover:bg-gray-700"}`}
        />
        <RoundedButton
          icon="play-skip-back"
          onPress={() => {
            console.log("Previous Button Pressed");
            handlePrevious();
          }}
          className="p-6 hover:bg-gray-700"
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
          onPress={() => {
            console.log("Next Button Pressed");
            handleNext();
          }}
          className="p-6 hover:bg-gray-700"
        />
        <RoundedButton
          icon="repeat"
          onPress={() => {
            console.log("Repeat Button Pressed");
            handleRepeat();
          }}
          className={`py-6 rounded-full ${repeatMode !== "none" ? "bg-orange-700" : "hover:bg-gray-700"}`}
        />
      </View>
      <View className="flex flex-row justify-between mt-20 mx-7 px-7">
        <Text className="text-gray-400">UP NEXT</Text>
        <Text className="text-gray-400">LYRICS</Text>
        <Text className="text-gray-400">RELATED</Text>
      </View>
    </View>
  );
};

export default Playing;
