import PlayerOptionsModal from "@/components/player-options-modal";
import Playing from "@/components/Playing";
import MusicOptions from "@/modules/music/components/music-options";
import { useFetchAlbums } from "@/modules/music/queries/fetch-albums";
import { useFetchArtists } from "@/modules/music/queries/fetch-artists";
import { useFetchSongs } from "@/modules/music/queries/fetch-songs";
import { useMusicControls } from "@/store/music-controls";
// import {  useMusicDataQuery } from "@/store/music-data";
import { useMusicView } from "@/store/music-view";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import React, { useRef } from "react";
import {
  Animated,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Text,
  View,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const HomeLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { playerView, overlayView } =
    useMusicView();
  const { isPlayerMenuOpen } = useMusicControls();

  const take = 100; // Default number of songs to fetch

  const { isLoading: iSSongsLoading } = useFetchSongs({
    take,
  }); // triggers fetch and syncs store
  const { isLoading: isAlbumsLoading } = useFetchAlbums({
    take,
  });
  const { isLoading: isArtistsLoading } = useFetchArtists({
    take,
  });

  const loadingStates = iSSongsLoading && isAlbumsLoading && isArtistsLoading;

  const animatedValue = useRef(new Animated.Value(0)).current; // 0: minimized, 1: full

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: playerView === "full" ? 1 : 0,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [playerView]);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_HEIGHT - 100, 0], // 100 = height of mini player
    extrapolate: "clamp",
  });

  return (
    <>
      {loadingStates && (
        <View className="absolute z-50 top-0 left-0 right-0 bottom-0 bg-black/80 items-center justify-center">
          <Text className="text-white text-lg">Loading music...</Text>
        </View>
      )}
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "white",
          tabBarBackground: () => (
            <View style={{ flex: 1, backgroundColor: "#262626" }} />
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Entypo name="home" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <FontAwesome6 name="compass" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: "Library",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="library-music" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
      {/* Global Overlay Player with Tailwind styles */}
      {playerView === "full" && (
        <Animated.View
          className="absolute left-0 right-0 bottom-0 z-50 w-full h-full justify-end bg-black"
          style={{ transform: [{ translateY }], height: SCREEN_HEIGHT }}
          pointerEvents="box-none"
        >
          <SafeAreaView className="flex-1">
            <View className="flex-1 h-full">
              {/* Minimize button at the top */}
              {overlayView === "player" ? <Playing /> : <MusicOptions />}
              {overlayView === "player" && isPlayerMenuOpen && (
                <PlayerOptionsModal />
              )}
            </View>
          </SafeAreaView>
        </Animated.View>
      )}
      <StatusBar barStyle="light-content" />
    </>
  );
};

export default HomeLayout;
