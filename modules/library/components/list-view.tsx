import { View, Text } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Entypo from "@expo/vector-icons/Entypo";

const ListView = () => {
  return (
    <View className="flex flex-col">
      <View className="w-full flex flex-row items-center justify-between">
        <View className="flex flex-row items-center">
          <View className="w-14 h-14 bg-white"></View>
          <View className="flex flex-col gap-1 ml-3">
            <Text className="text-white font-semibold">Liked Music</Text>
            <View className="flex flex-row items-center gap-2">
              <MaterialCommunityIcons name="pin" size={16} color="white" />
              <Text className="text-gray-300">Auto Playlist</Text>
            </View>
          </View>
        </View>
        <View>
          <Entypo name="dots-three-vertical" size={12} className="mr-2" color="white" />
        </View>
      </View>
      <View className="w-full h-20 flex flex-row items-center justify-between">
        <View className="flex flex-row items-center">
          <View className="w-14 h-14 rounded-full bg-white"></View>
          <View className="flex flex-col gap-1 mt-2 ml-3">
            <Text className="text-white font-semibold">Artist</Text>
            <Text className="text-gray-300">Artist Info</Text>
          </View>
        </View>
        <View>
          <Entypo name="dots-three-vertical" size={12} className="mr-2" color="white" />
        </View>
      </View>
      <View className="w-full h-20 flex flex-row items-center justify-between">
        <View className="flex flex-row items-center">
          <View className="w-14 h-14 bg-white"></View>
          <View className="flex flex-col gap-1 mt-2 ml-3">
            <Text className="text-white font-semibold">Album</Text>
            <Text className="text-gray-300">Album Info</Text>
          </View>
        </View>
        <View>
          <Entypo name="dots-three-vertical" size={12} className="mr-2" color="white" />
        </View>
      </View>
      <View className="w-full h-20 flex flex-row items-center justify-between">
        <View className="flex flex-row items-center">
          <View className="w-14 h-14 bg-white"></View>
          <View className="flex flex-col gap-1 mt-2 ml-3">
            <Text className="text-white font-semibold">Album</Text>
            <Text className="text-gray-300">Album Info</Text>
          </View>
        </View>
        <View>
          <Entypo name="dots-three-vertical" size={12} className="mr-2" color="white" />
        </View>
      </View>
    </View>
  );
};

export default ListView;
