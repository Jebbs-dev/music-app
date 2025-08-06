import { useDebounce } from "@/hooks/use-debounce";
import { useFetchAlbums } from "@/modules/music/queries/albums/fetch-albums";
import { useFetchArtists } from "@/modules/music/queries/artists/fetch-artists";
import { useFetchSongs } from "@/modules/music/queries/songs/fetch-songs";
import { Album, Artist, SongData } from "@/modules/music/types/types";
import { useMusicControls } from "@/store/music-controls";
import { useMusicData } from "@/store/music-data";
import { useMusicView } from "@/store/music-view";
import { getYear } from "@/utils/time-format";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  FlatList,
  Image,
  Keyboard,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type SearchResult =
  | (SongData & { type: "SongData" })
  | (Album & { type: "Album" })
  | (Artist & { type: "Artist" });

const SearchOverlay = () => {
  const isPresented = router.canGoBack();

  const { setIsPlaying, setCurrentSong } = useMusicControls();

  const { data, setSelectedSong, setCurrentArtist, setCurrentAlbum } =
    useMusicData();
  const {
    setSearchModalVisible,
    setPlayerView,
    setArtistModalVisible,
    setAlbumModalVisible,
  } = useMusicView();

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

  const allSearchedData: SearchResult[] = [
    ...(flattenedSongs?.map((song) => ({
      ...song,
      type: "SongData" as const,
    })) ?? []),
    ...(flattenedArtists?.map((artist) => ({
      ...artist,
      type: "Artist" as const,
    })) ?? []),
    ...(flattenedAlbums?.map((album) => ({
      ...album,
      type: "Album" as const,
    })) ?? []),
  ];

  const searchDataToBeDisplayed: SearchResult[] = allSearchedData.slice(0, 5);

  // const searchDataToBeDisplayed: Album[] | Artist[] | SongData[] = allSearchedData.slice(0, 5);

  return (
    <View className="flex-1 bg-black/95">
      <LinearGradient
        colors={["#181818", "#000000"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView className="h-full">
            <View className="flex flex-row justify-between items-center mx-7 mt-2">
              {/* {isPresented && ( */}
              <TouchableOpacity onPress={() => setSearchModalVisible(false)}>
                {/* <Link href="../"> */}
                <Entypo name="chevron-thin-left" size={18} color="#fff" />
                {/* </Link> */}
              </TouchableOpacity>
              {/* )} */}

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
                <MaterialCommunityIcons
                  name="microphone"
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
            </View>

            {queryKey === "" && (
              <View className="mt-10 mb-3 mx-4 flex flex-col gap-4">
                <Text className="text-gray-400">Recent searches</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {slicedData.map((song, index) => (
                    <View key={song.id || index}>
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

            <View>
              {Array.from({ length: 6 }, (_, index) => (
                <View
                  key={index}
                  className="flex flex-row justify-between items-center mx-7 mt-5"
                >
                  <MaterialIcons name="history" size={20} color="white" />
                  <Text className="text-gray-200">Dummy search parameter</Text>
                  <Feather name="arrow-up-left" size={20} color="white" />
                </View>
              ))}
            </View>

            <View className="mt-7 pt-5 border-t border-gray-400">
              {isSearchedSongsLoading ||
              isSearchedArtistsLoading ||
              isSearchedAlbumsLoading ? (
                <View className="flex items-center justify-center">
                  <Text className="text-white">Loading</Text>
                </View>
              ) : (
                <FlatList
                  data={searchDataToBeDisplayed}
                  keyExtractor={(item, index) => {
                    if (item.type === "SongData")
                      return `song-${item.id ?? index}`;
                    if (item.type === "Album")
                      return `album-${item.id ?? index}`;
                    if (item.type === "Artist")
                      return `artist-${item.id ?? index}`;
                    return index.toString();
                  }}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        if (item.type === "SongData") {
                          setSelectedSong(item);
                          setCurrentSong(item);
                          setIsPlaying(true);
                          setPlayerView("full");
                        }

                        if (item.type === "Artist") {
                          setArtistModalVisible(true);
                          setCurrentArtist(item);
                        }

                        if (item.type === "Album") {
                          setAlbumModalVisible(true);
                          setCurrentAlbum(item);
                        }
                      }}
                    >
                      <View
                        className={`w-full h-20 flex flex-row items-center justify-between p-3`}
                      >
                        <View className="flex flex-row items-center">
                          <View className="w-14 h-14">
                            <Image
                              source={
                                item.type === "Artist"
                                  ? typeof item.image === "string"
                                    ? { uri: item.image }
                                    : item.image
                                  : typeof item.coverImage === "string"
                                    ? { uri: item.coverImage }
                                    : item.coverImage
                              }
                              alt="image"
                              width={25}
                              height={25}
                              className="w-full h-full"
                            />
                          </View>
                          <View className="flex flex-col gap-1 ml-5">
                            <Text className="text-white font-semibold w-[95%]">
                              {item.type === "Artist" ? item.name : item.title}
                            </Text>
                            <View className="flex flex-row gap-1">
                              <Text className="text-gray-300">
                                {item.type === "Artist"
                                  ? "Artist"
                                  : item.type === "SongData"
                                    ? "Song"
                                    : item.type === "Album"
                                      ? "Album"
                                      : "Unknown"}
                              </Text>
                              <Entypo
                                name="dot-single"
                                size={13}
                                color="white"
                                className="top-0.5"
                              />
                              <Text className="text-gray-300">
                                {item.type === "Album"
                                  ? item.artist?.name
                                  : item.type === "SongData"
                                    ? item.artist?.name
                                    : item.type === "Artist"
                                      ? item.name
                                      : "Unknown"}
                              </Text>
                              <Entypo
                                name="dot-single"
                                size={13}
                                color="white"
                                className="top-0.5"
                              />

                              <Text className="text-gray-300">
                                {item.type === "Album"
                                  ? getYear(String(item.releaseDate))
                                  : item.type === "SongData"
                                    ? getYear(String(item.releaseDate))
                                    : item.type === "Artist"
                                      ? ""
                                      : "Unknown"}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View className="">
                          <Entypo
                            name="dots-three-vertical"
                            size={12}
                            className="mr-2"
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
        </TouchableWithoutFeedback>
      </LinearGradient>
    </View>
  );
};

export default SearchOverlay;
