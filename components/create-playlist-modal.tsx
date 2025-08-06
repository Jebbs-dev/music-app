import {
  CreatePlaylistPayload,
  useCreatePlaylist,
} from "@/modules/library/mutations/create-playlist";
import { useAuthStore } from "@/store/auth-store";
import { useMusicControls } from "@/store/music-controls";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  Modal,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { CustomTypescriptDropdown, DropdownOption } from "./custom-dropdown";
import { router } from "expo-router";

const CreatePlaylistModal = () => {
  const { isPlaylistCreateModalOpen, setIsPlaylistCreateModalOpen } =
    useMusicControls();
  const { user } = useAuthStore();
  const createPlaylistMutation = useCreatePlaylist();

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedValue, setSelectedValue] = useState<string>("public");
  const [errors, setErrors] = useState<{ name?: string; description?: string }>(
    {}
  );

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

  const validateForm = (): boolean => {
    const newErrors: { name?: string; description?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Playlist name is required";
    } else if (name.trim().length < 3) {
      newErrors.name = "Playlist name must be at least 3 characters";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    } else if (description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (!user?.id) {
      Alert.alert("Error", "User not authenticated. Please log in again.");
      return;
    }

    const playlistData: CreatePlaylistPayload = {
      name: name.trim(),
      description: description.trim(),
      isPublic: selectedValue === "public",
      userId: user.id,
    };

    try {
      await createPlaylistMutation.mutateAsync(playlistData);

      // Reset form and close modal on success
      setName("");
      setDescription("");
      setSelectedValue("public");
      setErrors({});
      setIsPlaylistCreateModalOpen(false);

      Alert.alert("Success", "Playlist created successfully!", [
        {
          text: "Go to Library",
          onPress: () => router.push("/(home)/library"),
          style: "default",
        },
        {
          text: "Stay Here",
          style: "cancel",
        },
      ]);
    } catch (error: any) {
      // Error is handled by the mutation's onError callback
      Alert.alert(
        "Failed to create playlist",
        error?.response?.data?.message ||
          "An error occurred during this action. Please try again.",
        [],
        {
          cancelable: true,
        }
      );
    }
  };

  const handleCancel = () => {
    // Reset form and close modal
    setName("");
    setDescription("");
    setSelectedValue("public");
    setErrors({});
    setIsPlaylistCreateModalOpen(false);
  };

  const isSubmitDisabled =
    !name.trim() || !description.trim() || createPlaylistMutation.isPending;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isPlaylistCreateModalOpen}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView className="h-full w-full flex items-center">
          <View
            className="w-80 mt-32 h-[45%] p-5 rounded-md"
            style={{ backgroundColor: "#3c3c3c" }}
          >
            <Text className="text-white font-bold text-xl mb-4">
              New Playlist
            </Text>

            <View className="mb-3">
              <TextInput
                placeholder="Enter playlist name"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
                autoFocus
                className="border-b py-4 rounded-md text-white border-gray-300 focus:border-blue-400"
              />
              {errors.name && (
                <Text className="text-red-400 text-sm mt-1">{errors.name}</Text>
              )}
            </View>

            <View className="mb-3">
              <TextInput
                placeholder="Description"
                placeholderTextColor="#9CA3AF"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                className="border-b py-4 rounded-md text-white border-gray-300 focus:border-blue-400"
              />
              {errors.description && (
                <Text className="text-red-400 text-sm mt-1">
                  {errors.description}
                </Text>
              )}
            </View>

            <Text className="text-gray-300 font-semibold mt-3 mb-3">
              Privacy
            </Text>

            <CustomTypescriptDropdown
              value={selectedValue}
              onValueChange={handleValueChange}
              options={privacyOptions}
              placeholder="Select privacy level"
            />

            <View className="flex flex-row justify-end gap-3 mt-6">
              <TouchableOpacity
                className="px-4 py-2.5 border border-gray-300 rounded-full"
                onPress={handleCancel}
                disabled={createPlaylistMutation.isPending}
              >
                <Text className="text-white font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`px-4 py-2.5 rounded-full ${
                  isSubmitDisabled ? "bg-gray-500" : "bg-white"
                }`}
                onPress={handleSubmit}
                disabled={isSubmitDisabled}
              >
                <Text
                  className={`font-semibold text-black
                }`}
                >
                  {createPlaylistMutation.isPending ? "Creating..." : "Create"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CreatePlaylistModal;
