import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Link, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";

const SearchOverlay = () => {
  const isPresented = router.canGoBack();



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
            <Link href="../">
              <Entypo name="chevron-thin-left" size={18} color="#fff" />
            </Link>
          )}
          <TextInput
            className="rounded-full px-3 py-2.5 w-[70%] bg-neutral-800 text-gray-400"
            placeholder="Search songs, artists, podcasts"
            autoFocus
          />

          <TouchableOpacity className="rounded-full p-2 ">
            <MaterialCommunityIcons name="microphone" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View>
          <Text>Recent Searches</Text>
          <View>
            <FlatList/>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default SearchOverlay;
