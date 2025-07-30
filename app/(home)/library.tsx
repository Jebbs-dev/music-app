import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useMusicView } from "@/store/music-view";
import PlayingMini from "@/components/PlayingMini";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { Link } from "expo-router";
import ListView from "@/modules/library/components/list-view";
import { useLibraryView } from "@/store/library-view";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import GridView from "@/modules/library/components/grid-view";

const Library = () => {
  const { playerView, setPlayerView } = useMusicView();
  const { libraryDataView, setLibraryDataView } = useLibraryView();

  const libraryCategories = [
    "Playlists",
    "Songs",
    "Albums",
    "Artists",
    "Podcasts",
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
          <View className="mt-5 w-full flex flex-row justify-between items-center px-4">
            <View>
              <Text className="text-white text-2xl">Library</Text>
            </View>
            <View className="flex flex-row gap-6 items-center">
              <TouchableOpacity>
                <MaterialCommunityIcons
                  name="history"
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
              <Link href="/search-modal">
                <Ionicons name="search-outline" size={24} color="white" />
              </Link>
              <TouchableOpacity>
                <FontAwesome name="circle" size={30} color="gray" />
              </TouchableOpacity>
            </View>
          </View>
          <View className="mt-5">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, padding: 16 }}
            >
              {libraryCategories.map((category, index) => (
                <View
                  key={index}
                  className="border border-gray-300/20 bg-gray-400/20 rounded-lg px-4 py-3"
                >
                  <Text className="text-white text-[16px] font-medium">
                    {category}
                  </Text>
                </View>
              ))}
            </ScrollView>
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
            {libraryDataView === "gridView" ? <ListView /> : <GridView />}
          </View>

          {playerView === "minimized" && (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                setPlayerView("full");
              }}
              className="w-full absolute bottom-0"
              // style={[{ transform: [{ translateY }] }]}
            >
              <PlayingMini position="bottom" background="default" />
            </TouchableOpacity>
          )}
        </SafeAreaView>
      </LinearGradient>
    </>
  );
};

export default Library;
