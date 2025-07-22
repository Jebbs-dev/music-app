import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ScrollView,
  Image,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import { Link, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import { useMusicData } from "@/store/music-data";
import { useFetchSongs } from "@/modules/music/queries/fetch-songs";
import { useFetchAlbums } from "@/modules/music/queries/fetch-albums";
import { useFetchArtists } from "@/modules/music/queries/fetch-artists";
import { Artist } from "@/modules/music/types/types";
import { useDebounce } from "@/hooks/use-debounce";

const SearchOverlay = () => {
  const isPresented = router.canGoBack();

  const { data, albumsData, artistsData } = useMusicData();

  const searchInputRef = useRef(null);
  const [queryKey, setQueryKey] = useState("");

  const debouncedQuery = useDebounce(queryKey, 1000);

  const slicedData = data.slice(0, 5);

  const { data: searchedSongs, isLoading: isSearchedSongsLoading } =
    useFetchSongs({
      take: 100,
      search: debouncedQuery,
    });
  const { data: searchedAlbums, isLoading: isSearchedAlbumsLoading } =
    useFetchAlbums({
      take: 100,
      search: debouncedQuery,
    });
  const { data: searchedArtists, isLoading: isSearchedArtistsLoading } =
    useFetchArtists({
      take: 100,
      search: debouncedQuery,
    });

  const flattenedSongs = searchedSongs?.pages.flat();
  const flattenedArtists = searchedArtists?.pages.flat();
  const flattenedAlbums = searchedAlbums?.pages.flat();

  const allSearchedData = [
    ...(flattenedSongs ?? []),
    ...(flattenedArtists ?? []),
    ...(flattenedAlbums ?? []),
  ];

  const searchDataToBeDisplayed = allSearchedData.slice(0, 5);

  return (
    <LinearGradient
      colors={["#181818", "#000000"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      // style={{ flex: 1 }}
    >
      <SafeAreaView className="h-full ">
        <View className="flex flex-row justify-between items-center mx-7 mt-2">
          {isPresented && (
            <TouchableOpacity>
              <Link href="../">
                <Entypo name="chevron-thin-left" size={18} color="#fff" />
              </Link>
            </TouchableOpacity>
          )}
          <TextInput
            className="rounded-full px-3 py-2.5 w-[70%] bg-neutral-800 text-gray-400"
            placeholder="Search songs, artists, podcasts"
            autoFocus
            ref={searchInputRef}
            value={queryKey}
            onChangeText={(queryKey) => {
              setQueryKey(queryKey);
            }}
          />

          <TouchableOpacity className="rounded-full p-2 ">
            <MaterialCommunityIcons name="microphone" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {queryKey === "" && (
          <View className="mt-10 mx-4 flex flex-col gap-4">
            <Text className="text-gray-400">Recent searches</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {slicedData.map((song, index) => (
                <View key={index}>
                  <View className="w-20 h-20 mr-5">
                    <Image
                      source={
                        typeof song.coverImage === "string"
                          ? { uri: song.coverImage }
                          : song.coverImage
                      }
                      className="w-full h-full"
                    />
                  </View>
                  <Text
                    numberOfLines={1}
                    className="text-gray-100 w-20 mt-1 text-sm"
                  >
                    {song.title}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {Array.from({ length: 6 }, (_, index) => (
          <View
            key={index}
            className="flex flex-row justify-between items-center mx-7 mt-10"
          >
            <MaterialIcons name="history" size={20} color="white" />
            <Text className="text-gray-200">Dummy search parameter</Text>
            <Feather name="arrow-up-left" size={20} color="white" />
          </View>
        ))}

        <View className="mt-7 pt-5 border-t border-gray-400">
          {isSearchedSongsLoading ||
          isSearchedArtistsLoading ||
          isSearchedAlbumsLoading ? (
            <View className="flex items-center justify-center">
              <Text>Loading</Text>
            </View>
          ) : (
            <FlatList
              data={searchDataToBeDisplayed}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity>
                  <View
                    className={`w-full h-20 flex flex-row items-center justify-between p-3 
            `}
                  >
                    <View className="flex flex-row items-center">
                      <View className="w-14 h-14">
                        <Image
                          source={
                            typeof item?.coverImage === "string"
                              ? { uri: item.coverImage }
                              : item.coverImage
                          }
                          alt="image"
                          width={25}
                          height={25}
                          className="w-full h-full"
                        />
                      </View>
                      {}
                      <View className="flex flex-col gap-1 ml-5">
                        <Text className="text-white font-semibold">
                          {item.title}
                        </Text>
                        <View className="flex flex-row gap-3">
                          <Text className="text-gray-300">
                            {item.type === "Album"
                              ? "Album"
                              : item.type === "SongData"
                                ? "Song"
                                : item.type === "Artist"
                                  ? "Artist"
                                  : "Unknown"}
                          </Text>
                          <Text>
                            {item.type === "Album"
                              ? item?.artist.name
                              : item.type === "SongData"
                                ? item?.artist.name
                                : item.type === "Artist"
                                  ? item.name
                                  : "Unknown"}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View className="mr-3">
                      <MaterialCommunityIcons
                        name="drag-horizontal-variant"
                        size={24}
                        color="white"
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default SearchOverlay;
