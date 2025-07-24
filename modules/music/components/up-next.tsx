import { useMusicData } from "@/store/music-data";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

const UpNext = () => {
  const { data, selectedSong, setSelectedSong } = useMusicData();

  const slicedData = data.slice(0, 5); 

  return (
    <View className="h-full">
      <FlatList
        data={slicedData}
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
        contentContainerStyle={{ paddingBottom: 100 }} // Ensure space for the mini player
      />
    </View>
  );
};

export default UpNext;
