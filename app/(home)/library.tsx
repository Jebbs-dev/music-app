import GridView from "@/modules/library/components/grid-view";
import ListView from "@/modules/library/components/list-view";
import { Album, Artist, Playlist, SongData } from "@/modules/music/types/types";
import useAuthStore from "@/store/auth-store";
import { LibraryOptionsTypes, useLibraryView } from "@/store/library-view";
import { useMusicData } from "@/store/music-data";
import { useMusicView } from "@/store/music-view";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";

export type LibraryDataTypes =
  | (SongData & { type: "SongData" })
  | (Artist & { type: "Artist" })
  | (Album & { type: "Album" })
  | (Playlist & { type: "Playlist" });

const Library = () => {
  const { setSearchModalVisible } = useMusicView();
  const {
    libraryDataView,
    setLibraryDataView,
    libraryOptions,
    setLibraryOptions,
  } = useLibraryView();

  const { user } = useAuthStore();

  const { libraryData } = useMusicData();

  // const librarySongs = fetchLibrary.data?.songs;
  const libraryAlbums = libraryData?.albums;
  const libraryArtists = libraryData?.artists;
  const playlists = libraryData?.playlists;

  const fetchedLibraryData = [
    // ...(librarySongs?.map((song: SongData) => ({
    //   ...song,
    //   type: "SongData" as const,
    // })) ?? []),
    ...(libraryArtists?.map((artist: any) => ({
      ...(artist.artist as Artist),
      type: "Artist" as const,
    })) ?? []),
    ...(libraryAlbums?.map((album: any) => ({
      ...(album.album as Album),
      type: "Album" as const,
    })) ?? []),
    ...(playlists?.map((playlist: Playlist) => ({
      ...playlist,
      type: "Playlist" as const,
    })) ?? []),
  ];

  const libraryCategories: { title: string; value: LibraryOptionsTypes }[] = [
    { title: "Playlists", value: "playlists" },
    { title: "Songs", value: "songs" },
    { title: "Albums", value: "albums" },
    { title: "Artists", value: "artists" },
    { title: "Podcasts", value: "podcasts" },
  ];

  return (
    <>
      <LinearGradient
        colors={["#7A0C15", "#181818", "#000000"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        // style={{ flex: 1 }}
      >
        <SafeAreaView className="h-full">
          <View className="android:mt-16 mt-5 w-full flex flex-row justify-between items-center px-4">
            <View>
              <Text className="text-white text-3xl font-semibold">Library</Text>
            </View>
            <View className="flex flex-row gap-6 items-center">
              <TouchableOpacity>
                <MaterialCommunityIcons
                  name="history"
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSearchModalVisible(true)}>
                <Ionicons name="search-outline" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity>
                <FontAwesome name="circle" size={30} color="gray" />
              </TouchableOpacity>
            </View>
          </View>
          <View className="mt-5">
            {libraryOptions !== "overview" ? (
              <View className="mx-4 flex flex-row py-4">
                <TouchableOpacity
                  className="px-4 py-3 mr-3 bg-white rounded-lg items-center justify-center"
                  onPress={() => setLibraryOptions("overview")}
                >
                  <EvilIcons name="close" size={24} color="black" />
                </TouchableOpacity>

                <View
                  className={`border border-gray-300/20  rounded-lg px-4 py-3 bg-white`}
                >
                  <Text className={`text-[16px] font-medium text-stone-900 `}>
                    {libraryOptions}
                  </Text>
                </View>
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, padding: 16 }}
              >
                {libraryCategories.map((category, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setLibraryOptions(category.value)}
                  >
                    <View
                      className={`border border-gray-300/20  rounded-lg px-4 py-3 bg-gray-400/20`}
                    >
                      <Text className={`text-[16px] font-medium text-white`}>
                        {category.title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          <View className="mt-5 px-4 flex flex-row justify-between items-center">
            <View className="flex flex-row gap-4 items-center">
              <Text className="text-white font-semibold">Recent Activity</Text>
              <Entypo name="chevron-thin-down" size={15} color="white" />
            </View>

            <View className="flex items-center">
              <TouchableOpacity>
                {libraryDataView === "gridView" ? (
                  <MaterialIcons
                    name="list"
                    size={20}
                    color="white"
                    onPress={() => setLibraryDataView("listView")}
                  />
                ) : (
                  <SimpleLineIcons
                    name="grid"
                    size={16}
                    color="white"
                    onPress={() => setLibraryDataView("gridView")}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View className="mt-5 mx-4">
            {libraryDataView === "listView" ? (
              <ListView data={fetchedLibraryData} />
            ) : (
              <GridView data={fetchedLibraryData} />
            )}
          </View>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
};

export default Library;
