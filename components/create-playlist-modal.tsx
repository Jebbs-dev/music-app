import {
  View,
  Text,
  Modal,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useMusicControls } from "@/store/music-controls";
import { CustomTypescriptDropdown, DropdownOption } from "./custom-dropdown";

const CreatePlaylistModal = () => {
  const { isPlaylistCreateModalOpen } = useMusicControls();

  const [selectedValue, setSelectedValue] = useState<string>("public");

  const privacyOptions: DropdownOption[] = [
    {
      label: "Public",
      value: "public",
      icon: "globe",
      iconType: FontAwesome,
    },
    {
      label: "Private",
      value: "private",
      icon: "lock",
      iconType: AntDesign,
    },
  ];

  const handleValueChange = (value: string): void => {
    setSelectedValue(value);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isPlaylistCreateModalOpen}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView className="h-full w-full flex items-center">
          <View
            className="w-80 mt-32 h-[40%] p-5 rounded-md"
            style={{ backgroundColor: "#3c3c3c" }}
          >
            <Text className="text-white font-bold text-xl">New Playlist</Text>
            <TextInput
              placeholder="Enter playlist name"
              placeholderTextColor="#9CA3AF"
              autoFocus
              className="border-b py-4 rounded-md text-white border-gray-300 focus:border-blue-400"
            />
            <TextInput
              placeholder="Description"
              placeholderTextColor="#9CA3AF"
              className="border-b py-4 rounded-md text-white border-gray-300 focus:border-blue-400"
            />
            <Text className="text-gray-300 font-semibold mt-3 mb-3">
              Privacy
            </Text>

            <CustomTypescriptDropdown
              value={selectedValue}
              onValueChange={handleValueChange}
              options={privacyOptions}
              placeholder="Select privacy level"
            />

            <View className="flex flex-row justify-end gap-3 mt-4">
              <TouchableOpacity className="px-4 py-2.5 border border-gray-300 rounded-full">
                <Text className="text-white font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity className="px-4 py-2.5 bg-slate-500/70 rounded-full">
                <Text className="font-semibold">Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CreatePlaylistModal;
