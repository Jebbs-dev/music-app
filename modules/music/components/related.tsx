import { View, Text, Image, TouchableOpacity } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useMusicData } from "@/store/music-data";
import { useEffect, useState } from "react";

const Related = () => {
  const { selectedSong, setSelectedSong, data, setMusicData } = useMusicData();

  // const takeNumber = 10;

  // const {
  //   data: songs,
  //   isLoading,
  //   isError,
  //   fetchNextPage,
  //   hasNextPage,
  //   isFetchingNextPage,
  // } = useFetchSongs({
  //   take: takeNumber,
  // });

  // const allsongs = songs?.pages.flat() || [];

  // if (allsongs) {
  //   setMusicData([...allsongs]);
  // }

  const slicedSongs = data.slice(5);

  // if (isLoading) {
  //   return (
  //     <View className="flex-1 items-center justify-center">
  //       <Text className="text-white">Loading...</Text>
  //     </View>
  //   );
  // }

  // const interval = setInterval(() => {
  //   if (hasNextPage && !isFetchingNextPage) {
  //     fetchNextPage();
  //   }
  // }, 20000);

  // if(!hasNextPage){
  //   clearInterval(interval);
  // }

  // Auto-load next page after 20 seconds if not at end

  return (
    <View className="h-full">
      <FlatList
        data={slicedSongs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedSong(item)}>
            <View
              className={`w-full h-20 flex flex-row items-center justify-between p-3 
            ${selectedSong?.id === item.id ? "bg-neutral-800/50" : ""}`}
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
                <View className="flex flex-col gap-1 ml-5">
                  <Text className="text-white font-semibold">{item.title}</Text>
                  <Text className="text-gray-300">{item.artist?.name}</Text>
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
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
};

export default Related;
