import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useMusicData } from "@/store/music-data";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const UpNext = () => {
  const { data, selectedSong, setSelectedSong } = useMusicData();

  return (
    <View className="h-full">
      <FlatList
        data={data}
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
                      typeof item?.artwork === "string"
                        ? { uri: item.artwork }
                        : item.artwork
                    }
                    alt="image"
                    width={25}
                    height={25}
                    className="w-full h-full"
                  />
                </View>
                <View className="flex flex-col gap-1 ml-5">
                  <Text className="text-white font-semibold">{item.title}</Text>
                  <Text className="text-gray-300">{item.artist}</Text>
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
