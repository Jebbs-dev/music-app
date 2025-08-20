import { useMusicControls } from "@/store/music-controls";
import { useMusicData } from "@/store/music-data";
import { formatTime } from "@/utils/time-format";
import { Slider } from "react-native-awesome-slider";
import { Artist } from "@/modules/music/types/types";
import { useMusicView } from "@/store/music-view";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";
import { createAudioPlayer, setAudioModeAsync } from "expo-audio";
import React, { useEffect, useRef } from "react";
import {
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
import { useAddSongToLibrary } from "@/modules/library/mutations/add-song-to-library";
import useAuthStore from "@/store/auth-store";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const Playing = () => {
  const {
    selectedSong,
    setSelectedSong,
    data,
    librarySongs,
    artistsData,
  } = useMusicData();

  const {
    isPlaying,
    setIsPlaying,
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
    player,
    lastPlayedSongUrl,
    setLastPlayedSongUrl,
    setIsPlaylistMenuOpen,
    currentSongIndex,
    setCurrentSongIndex,
    // New playlist properties
    currentPlaylist,
    playlistContext,
    // New navigation methods
    playNext,
    playPrevious,
    shuffle,
  } = useMusicControls();

  const {
    setPlayerView,
    setOverlayView,
    setMusicViewOption,
    setArtistModalVisible,
  } = useMusicView();

  const { user } = useAuthStore();

  const router = useRouter()

  const addSongToLibraryMutation = useAddSongToLibrary(
    String(user?.id),
    currentSong?.id
  );

  const currentArtist: Artist | undefined = artistsData.find(
    (artist: Artist) => artist.id === currentSong?.artistId
  );

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
  }, []);

  // When currentSong changes, replace the audio source
  useEffect(() => {
    if (player && currentSong?.url && lastPlayedSongUrl !== currentSong.url) {
      player.replace(currentSong.url);
      setPosition(0);
      setDuration(0);
      setLastPlayedSongUrl(currentSong.url);
    }
  }, [player, currentSong]);

  // Play/pause effect
  useEffect(() => {
    if (!player) return;
    if (isPlaying) {
      player.play();
    } else {
      player.pause();
    }

    // Initialize playlist if empty but we have data
    if (currentPlaylist.length === 0 && data.length > 0 && currentSong?.id) {
      // If no playlist is set, default to all songs
      const songIndex = data.findIndex((s) => s.id === currentSong.id);
      if (songIndex >= 0) {
        const { setCurrentPlaylist, setCurrentSongIndex, setPlaylistContext } =
          useMusicControls.getState();
        setCurrentPlaylist(data);
        setCurrentSongIndex(songIndex);
        setPlaylistContext({ type: "all", name: "Library" });
      }
    }

    if (!selectedSong && currentSong) {
      setSelectedSong(currentSong);
    }
  }, [isPlaying, player, currentPlaylist, data, currentSong]);

  // Add polling for position and duration
  useEffect(() => {
    if (!player) return;
    const interval = setInterval(() => {
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
    }, 500);
    return () => clearInterval(interval);
  }, [player]);

  // Auto-advance to next song when current song ends
  useEffect(() => {
    if (duration > 0 && position >= duration - 0.5) {
      // 0.5 second buffer
      if (repeatMode === "one") {
        // Restart the same song
        if (player) {
          player.seekTo(0);
          setPosition(0);
        }
      } else {
        // Move to next song
        playNext();
      }
    }
  }, [position, duration, repeatMode, playNext]);

  const progress = useSharedValue(position);
  const minimumValue = useSharedValue(0);
  const maximumValue = useSharedValue(duration || 1);

  useEffect(() => {
    progress.value = position;
    maximumValue.value = duration || 1;
  }, [position, duration]);

  const isSongInLibrary = librarySongs.some(
    (song) => song.id === currentSong?.id
  );

  const handleAddSongToLibrary = async () => {
    try {
      if (currentSong?.id) {
        await addSongToLibraryMutation.mutateAsync(currentSong);
      }
    } catch (error: any) {
      console.error(error);
    }
  };

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

  const handleNext = () => {
    console.log("Next Button Pressed");
    playNext();
  };

  const handlePrevious = () => {
    console.log("Previous Button Pressed");
    playPrevious();
  };

  const handleShuffle = () => {
    console.log("Shuffle Button Pressed");
    shuffle();
  };

  const handleRepeat = () => {
    const modes: ("none" | "one" | "all")[] = ["none", "one", "all"];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
    console.log("Repeat mode changed to:", modes[nextIndex]);
  };

  // Get context display text
  const getContextText = () => {
    switch (playlistContext.type) {
      case "artist":
        return `${playlistContext.name} Radio`;
      case "album":
        return `Playing from ${playlistContext.name}`;
      case "all":
        return "Playing from Library";
      case "custom":
        return `Playing from ${playlistContext.name}`;
      default:
        return "Now Playing";
    }
  };

  if (!currentSong || !currentSong.id) {
    return (
      <LinearGradient
        colors={["#181818", "#000000"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView className="h-full flex items-center justify-center">
          <Text className="text-white text-lg">No song selected</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#181818", "#000000"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View className="h-full">
        <SafeAreaView className="h-full">
          <View className="flex flex-row justify-between mx-7 items-center ios:mt-7 android:mt-16">
            <Entypo
              name="chevron-thin-down"
              size={18}
              color="#fff"
              onPress={() => setPlayerView("minimized")}
            />
            <View className="flex flex-col items-center">
              <Text className="text-center text-white text-sm font-semibold uppercase">
                Playing Now
              </Text>
              <Text className="text-center text-gray-400 text-xs mt-1">
                {getContextText()}
              </Text>
            </View>
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
              className="text-center text-3xl font-semibold text-white"
              numberOfLines={1}
            >
              {currentSong.title}
            </Text>
            <TouchableOpacity
              onPress={() => {
                router.navigate(`/(home)/artists/${currentSong.artistId}`);
                setPlayerView("minimized");
              }}
            >
              <Text className="text-center text-gray-400 mt-1">
                {currentArtist?.name}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-5 pl-7 flex flex-row items-center gap-5 justify-evenly">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 16, zIndex: 999 }}
            >
              <TouchableOpacity
                className="flex flex-row items-center bg-stone-800 px-6 py-3 gap-3 rounded-full"
                onPress={handleAddSongToLibrary}
              >
                {isSongInLibrary ? (
                  <Ionicons name="thumbs-up-sharp" size={20} color="white" />
                ) : (
                  <Feather name="thumbs-up" size={20} color="white" />
                )}
                <Text className="text-white font-semibold">2.3k</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex flex-row items-center bg-stone-800 px-6 py-3 gap-3 rounded-full"
                onPress={() => {
                  setIsPlaylistMenuOpen(true);
                }}
              >
                <MaterialIcons name="playlist-add" size={20} color="white" />
                <Text className="text-white font-semibold">Save</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex flex-row items-center bg-stone-800 px-6 py-3 gap-3 rounded-full">
                <Octicons name="download" size={20} color="white" />
                <Text className="text-white font-semibold">Download</Text>
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
              onPress={handleShuffle}
              className={`py-6 ${isShuffleOn ? "text-orange-700" : "hover:bg-gray-700"}`}
              color={isShuffleOn ? "#c2410c" : "#ccc"}
            />
            <RoundedButton
              icon="play-skip-back"
              iconType="ionicon"
              onPress={handlePrevious}
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
              onPress={handleNext}
              className="p-6 hover:bg-gray-700"
              color="#ccc"
            />
            <RoundedButton
              iconType="others"
              otherIcon={MaterialIcons}
              icon="repeat"
              onPress={handleRepeat}
              className="py-6 rounded-full"
              color={repeatMode !== "none" ? "#c2410c" : "#ccc"}
            />
          </View>
          <View className="flex flex-row justify-between mt-12 android:mt-20 mx-7 px-7">
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
        </SafeAreaView>
      </View>
    </LinearGradient>
  );
};

export default Playing;
