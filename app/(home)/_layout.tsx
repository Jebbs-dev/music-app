import PlayerOptionsModal from "@/components/player-options-modal";
import SaveToPlaylistModal from "@/components/save-to-playlist-modal";
import Playing from "@/components/Playing";
import MusicOptions from "@/modules/music/components/music-options";
import { useFetchAlbums } from "@/modules/music/queries/albums/fetch-albums";
import { useFetchArtists } from "@/modules/music/queries/artists/fetch-artists";
import { useFetchSongs } from "@/modules/music/queries/songs/fetch-songs";
import { useMusicControls } from "@/store/music-controls";
import { useMusicView } from "@/store/music-view";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import React from "react";
import {
  Dimensions,
  StatusBar,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";

import PlayingMini from "@/components/PlayingMini";
import Fontisto from "@expo/vector-icons/Fontisto";
import ArtistProfile from "../../components/artist-profile";
import SearchOverlay from "../../components/search-modal";
import AlbumSongs from "../../components/album-songs";
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
    setOverlayView,
    artistModalVisible,
    searchModalVisible,
    albumModalVisible,
  } = useMusicView();

  const { user } = useAuthStore();

  const { isPlayerMenuOpen, isPlaylistMenuOpen, isPlaylistCreateModalOpen } =
    useMusicControls();

  const take = 100;

  const { isLoading: iSSongsLoading } = useFetchSongs({
    take,
  }); 
  const { isLoading: isAlbumsLoading } = useFetchAlbums({
    take,
  });
  const { isLoading: isArtistsLoading } = useFetchArtists({
    take,
  });

  const { isLoading: isLibraryLoading } = useFetchLibrary(String(user?.id));

  const loadingStates = iSSongsLoading && isAlbumsLoading && isArtistsLoading && isLibraryLoading;

 
  const playerProgress = useSharedValue(0); // 0: minimized, 1: full
  const searchModalOpacity = useSharedValue(0);
  const artistModalOpacity = useSharedValue(0);
  const albumModalOpacity = useSharedValue(0);

  React.useEffect(() => {
    playerProgress.value = withTiming(playerView === "full" ? 1 : 0, {
      duration: 350,
    });
  }, [playerView, playerProgress]);

  React.useEffect(() => {
    searchModalOpacity.value = withTiming(searchModalVisible ? 1 : 0, {
      duration: 300,
    });
  }, [searchModalVisible, searchModalOpacity]);

  React.useEffect(() => {
    artistModalOpacity.value = withTiming(artistModalVisible ? 1 : 0, {
      duration: 300,
    });
  }, [artistModalVisible, artistModalOpacity]);

  React.useEffect(() => {
    albumModalOpacity.value = withTiming(albumModalVisible ? 1 : 0, {
      duration: 300,
    });
  }, [albumModalVisible, albumModalOpacity]);

  const playerAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      playerProgress.value,
      [0, 1],
      [SCREEN_HEIGHT - 100, 0], // 100 = height of mini player
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY }],
    };
  });

  const searchModalAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: searchModalOpacity.value,
    };
  });

  const artistModalAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: artistModalOpacity.value,
    };
  });

  const albumModalAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: albumModalOpacity.value,
    };
  });

  return (
    <>
      {loadingStates && (
        <View className="absolute z-50 top-0 left-0 right-0 bottom-0 bg-black/80 items-center justify-center">
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
            setOverlayView("none");
          }}
          className="w-full absolute android:-bottom-5 bottom-0 z-[999]"
        >
          <PlayingMini position="bottom" background="default" />
        </TouchableOpacity>
      )}

      {/* Search Modal Overlay */}
      {searchModalVisible && (
        <Animated.View
          className="absolute top-0 left-0 right-0 bottom-0 z-50"
          style={searchModalAnimatedStyle}
          pointerEvents="box-none"
        >
          <SearchOverlay />
        </Animated.View>
      )}

      {/* Artist Profile Overlay */}
      {artistModalVisible && (
        <Animated.View
          className="absolute top-0 left-0 right-0 bottom-0 z-30"
          style={artistModalAnimatedStyle}
          pointerEvents="box-none"
        >
          <ArtistProfile />
        </Animated.View>
      )}

      {/* Album Modal Overlay */}
      {albumModalVisible && (
        <Animated.View
          className="absolute top-0 left-0 right-0 bottom-0 z-40"
          style={albumModalAnimatedStyle}
          pointerEvents="box-none"
        >
          <AlbumSongs />
        </Animated.View>
      )}

      {/* Global Overlay Player */}
      {playerView === "full" && (
        <Animated.View
          className="absolute left-0 right-0 bottom-0 z-50 w-full h-full justify-end bg-black"
          style={[
            playerAnimatedStyle,
            {
              height: "100%",
              zIndex: 9999,
            }
          ]}
          pointerEvents="box-none"
        >
          <View className="flex-1 h-full">
            <Playing />
            {overlayView === "options" && <MusicOptions />}
            {isPlayerMenuOpen && <PlayerOptionsModal />}
            {isPlaylistMenuOpen && <SaveToPlaylistModal />}
            {isPlaylistCreateModalOpen && <CreatePlaylistModal />}
          </View>
        </Animated.View>
      )}
      
      <StatusBar barStyle="light-content" />
    </>
  );
};

export default HomeLayout;