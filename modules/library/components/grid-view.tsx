import { View, Text } from 'react-native'
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const GridView = () => {
  return (
    <View className="flex flex-row flex-wrap gap-4 justify-center">
      <View className="w-[48%]">
        <View className="w-full h-48 rounded-md bg-gray-200" />
        <View className="flex flex-col mt-2 gap-1">
          <Text className="text-white font-semibold">Liked Music</Text>
          <View className="flex flex-row items-center gap-2">
            <MaterialCommunityIcons name="pin" size={16} color="white" />
            <Text className="text-gray-300">Auto Playlist</Text>
          </View>
        </View>
      </View>
      <View className="w-[48%]">
        <View className="w-full h-48 rounded-full bg-gray-200" />
        <View className="flex flex-col items-center gap-1 mt-2">
          <Text className="text-white font-semibold">Artist</Text>
          <Text className="text-gray-300">Artist Info</Text>
        </View>
      </View>
      <View className="w-[48%]">
        <View className="w-full h-48 rounded-md bg-gray-200" />
        <View className="flex flex-col gap-1 mt-2">
          <Text className="text-white font-semibold">Album</Text>
          <Text className="text-gray-300">Album Info</Text>
        </View>
      </View>
      <View className="w-[48%]">
        <View className="w-full h-48 rounded-md bg-gray-200" />
        <View className="flex flex-col gap-1 mt-2">
          <Text className="text-white font-semibold">Album</Text>
          <Text className="text-gray-300">Album Info</Text>
        </View>
      </View>
    </View>
  )
}

export default GridView