import PlayerOptionsModal from "@/components/player-options-modal";
import SaveToPlaylistModal from "@/components/save-to-playlist-modal";
import Playing from "@/components/Playing";
import MusicOptions from "@/modules/music/components/music-options";
import { useFetchAlbums } from "@/modules/music/queries/albums/fetch-albums";
import { useFetchArtists } from "@/modules/music/queries/artists/fetch-artists";
import { useFetchSongs } from "@/modules/music/queries/songs/fetch-songs";
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
  TouchableOpacity,
  View,
} from "react-native";

import PlayingMini from "@/components/PlayingMini";
import Fontisto from "@expo/vector-icons/Fontisto";
import ArtistProfile from "../../components/artist-profile";
import SearchOverlay from "../../components/search-modal";
import AlbumSongs from "../album-songs";
import CreatePlaylistModal from "@/components/create-playlist-modal";
import { useFetchLibrary } from "@/modules/library/queries/fetch-library";
import useAuthStore from "@/store/auth-store";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const HomeLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const {
    playerView,
    setPlayerView,
    overlayView,
    artistModalVisible,
    searchModalVisible,
    albumModalVisible,
  } = useMusicView();

  const { user } = useAuthStore();

  const { isPlayerMenuOpen, isPlaylistMenuOpen, isPlaylistCreateModalOpen } =
    useMusicControls();

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

  const { isLoading: isLibraryLoading } = useFetchLibrary(String(user?.id));

  const loadingStates = iSSongsLoading && isAlbumsLoading && isArtistsLoading && isLibraryLoading;

  const animatedValue = useRef(new Animated.Value(0)).current; // 0: minimized, 1: full
  const searchModalOpacity = useRef(new Animated.Value(0)).current;
  const artistModalOpacity = useRef(new Animated.Value(0)).current;
  const albumModalOpacity = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: playerView === "full" ? 1 : 0,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [playerView]);

  React.useEffect(() => {
    Animated.timing(searchModalOpacity, {
      toValue: searchModalVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [searchModalVisible]);

  React.useEffect(() => {
    Animated.timing(artistModalOpacity, {
      toValue: artistModalVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [artistModalVisible]);

  React.useEffect(() => {
    Animated.timing(albumModalOpacity, {
      toValue: albumModalVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [albumModalVisible]);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_HEIGHT - 100, 0], // 100 = height of mini player
    extrapolate: "clamp",
  });

  return (
    <>
      {loadingStates && (
        <View className="absolute z-50 top-0 left-0 right-0 bottom-0 bg-black/80 items-center justify-center">
          {/* <Text className="text-white text-lg">Loading music...</Text> */}
          <Fontisto
            name="spinner"
            size={30}
            color="white"
            className="animate-spin"
          />
        </View>
      )}
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "white",
          tabBarBackground: () => (
            <View style={{ flex: 1, backgroundColor: "#262626" }} />
          ),
          tabBarStyle: { zIndex: 999, elevation: 8 },
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

      {/* Mini Player positioned above tab bar */}
      {playerView === "minimized" && (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            setPlayerView("full");
          }}
          className="w-full absolute bottom-0 z-[999]"
          // style={[{ transform: [{ translateY }] }]}
        >
          <PlayingMini position="bottom" background="default" />
        </TouchableOpacity>
      )}

      {/* Search Modal Overlay */}
      {searchModalVisible && (
        <Animated.View
          className="absolute top-0 left-0 right-0 bottom-0 z-50"
          style={{ opacity: searchModalOpacity }}
          pointerEvents="box-none"
        >
          <SearchOverlay />
        </Animated.View>
      )}

      {/* Artist Profile Overlay */}
      {artistModalVisible && (
        <Animated.View
          className="absolute top-0 left-0 right-0 bottom-0 z-30"
          style={{ opacity: artistModalOpacity }}
          pointerEvents="box-none"
        >
          <ArtistProfile />
        </Animated.View>
      )}

      {albumModalVisible && (
        <Animated.View
          className="absolute top-0 left-0 right-0 bottom-0 z-40"
          style={{ opacity: albumModalOpacity }}
          pointerEvents="box-none"
        >
          <AlbumSongs />
        </Animated.View>
      )}

      {/* Global Overlay Player with Tailwind styles */}
      {playerView === "full" && (
        <Animated.View
          className="absolute left-0 right-0 bottom-0 z-50 w-full h-full justify-end bg-black"
          style={{
            transform: [{ translateY }],
            height: SCREEN_HEIGHT,
            zIndex: 9999,
          }}
          pointerEvents="box-none"
        >
          <View className="flex-1 h-full">
            {/* Minimize button at the top */}
            {overlayView === "player" ? <Playing /> : <MusicOptions />}
            {overlayView === "player" && isPlayerMenuOpen && (
              <PlayerOptionsModal />
            )}
            {overlayView === "player" && isPlaylistMenuOpen && (
              <SaveToPlaylistModal />
            )}
            {overlayView === "player" && isPlaylistCreateModalOpen && (
              <CreatePlaylistModal />
            )}
          </View>
        </Animated.View>
      )}
      <StatusBar barStyle="light-content" />
    </>
  );
};

export default HomeLayout;
