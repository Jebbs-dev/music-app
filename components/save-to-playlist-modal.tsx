import {
  View,
  Text,
  Modal,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import React from "react";
import { useMusicControls } from "@/store/music-controls";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useMusicData } from "@/store/music-data";
import { useAddSongToPlaylist } from "@/modules/library/mutations/add-song-to-playlist";
import { useRouter } from "expo-router";
import { useMusicView } from "@/store/music-view";

const SaveToPlaylistModal = () => {
  const {
    isPlaylistMenuOpen,
    setIsPlaylistMenuOpen,
    setIsPlaylistCreateModalOpen,
    currentSong,
  } = useMusicControls();

  const { libraryPlaylists } = useMusicData();

  const { setPlayerView } = useMusicView();

  const router = useRouter();

  const addSongToPlaylistMutation = useAddSongToPlaylist(currentSong.id);

  const translateY = useSharedValue(0);
  const THRESHOLD = 120;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const closeModal = () => {
    setIsPlaylistMenuOpen(false);

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
      } else {
        translateY.value = withSpring(0);
      }
    });

  const handleAddSongToPlaylist = async (playlistId: string) => {
    try {
      await addSongToPlaylistMutation.mutateAsync(playlistId);

      Alert.alert("", "Saved to Playlist!", [
        {
          text: "Library",
          onPress: () => {
            router.navigate(`/(home)/library`);
            setPlayerView("minimized");
            closeModal();
          },
          style: "default",
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        "Failed to add song to playlist",
        error?.response?.data?.message ||
          "An error occurred during this action. Please try again.",
        [],
        {
          cancelable: true,
        }
      );
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isPlaylistMenuOpen}
    >
      <SafeAreaView>
        <GestureDetector gesture={gesture}>
          <Animated.View
            style={[
              {
                height: "100%",
                marginTop: 20,
                backgroundColor: "#3c3c3c",
              },
              animatedStyle,
            ]}
          >
            <View className="flex flex-row items-center justify-between border-gray-300 border-b p-5">
              <Text className="font-semibold text-white">Save to playlist</Text>
              <TouchableOpacity onPress={closeModal}>
                <AntDesign name="close" size={18} color="white" />
              </TouchableOpacity>
            </View>

            <View className="p-5 border-gray-300 border-b">
              <Text className="font-semibold text-white mb-3">Recent</Text>
              <View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {libraryPlaylists.map((playlist, index) => (
                    <View key={index} className="mr-5">
                      <View className="flex flex-col">
                        <View className="flex flex-row w-20 h-10">
                          <View className="w-1/2  bg-gray-300"></View>
                          <View className="w-1/2 bg-orange-300"></View>
                        </View>
                        <View className="flex flex-row w-20 h-10">
                          <View className="w-1/2  bg-blue-300"></View>
                          <View className="w-1/2 bg-violet-300"></View>
                        </View>
                      </View>
                      <View className="mt-1 w-full">
                        <Text
                          className="text-xs text-white font-semibold truncate"
                          numberOfLines={1}
                        >
                          {playlist.name}
                        </Text>
                        <Text
                          className="text-xs text-gray-300 truncate"
                          numberOfLines={1}
                        >
                          {playlist._count?.songs} tracks
                        </Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>
            <View className="p-5">
              <Text className="font-semibold text-white mb-5">
                All Playlists
              </Text>
              <View>
                <ScrollView>
                  {libraryPlaylists.map((playlist, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        handleAddSongToPlaylist(playlist.id);
                      }}
                    >
                      <View className="flex flex-row mb-7 items-center gap-5">
                        <View className="flex flex-col rounded-sm">
                          <View className="flex flex-row w-14 h-7">
                            <View className="w-1/2  bg-gray-300 rounded-tl-sm"></View>
                            <View className="w-1/2 bg-orange-300 rounded-tr-sm"></View>
                          </View>
                          <View className="flex flex-row w-14 h-7">
                            <View className="w-1/2  bg-blue-300 rounded-bl-sm"></View>
                            <View className="w-1/2 bg-violet-300 rounded-br-sm"></View>
                          </View>
                        </View>
                        <View className="mt-1 w-full">
                          <Text
                            className=" text-white font-semibold truncate"
                            numberOfLines={1}
                          >
                            {playlist.name}
                          </Text>
                          <Text
                            className="text-gray-300 truncate"
                            numberOfLines={1}
                          >
                            {playlist._count?.songs} tracks
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
            <TouchableOpacity
              className="absolute bottom-20 right-5 flex flex-row items-center gap-2 px-4 py-3 bg-white rounded-full"
              onPress={() => {
                closeModal();
                setIsPlaylistCreateModalOpen(true);
              }}
            >
              <AntDesign name="plus" size={20} color="black" />
              <Text className="font-semibold ">New Playlist</Text>
            </TouchableOpacity>
          </Animated.View>
        </GestureDetector>
      </SafeAreaView>
    </Modal>
  );
};

export default SaveToPlaylistModal;
