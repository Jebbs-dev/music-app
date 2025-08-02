import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
  ListRenderItem,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Icon } from "@expo/vector-icons/build/createIconSet";
import Entypo from '@expo/vector-icons/Entypo';

export interface DropdownOption {
  label: string;
  value: string;
  icon: string;
  iconType: React.ComponentType<any>;
}

interface CustomDropdownProps {
  value: string;
  onValueChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  disabled?: boolean;
}

// const CustomDropdown = ({
//   value,
//   onValueChange,
//   options,
//   placeholder = "Select an option",
//   disabled = false,
// }: CustomDropdownProps) => {
//   const [isVisible, setIsVisible] = useState(false);
//   const selectedOption = options.find((option) => option.value === value);

//   const handleSelect = (option: DropdownOption) => {
//     onValueChange(option.value);
//     setIsVisible(false);
//   };

//   const renderOption: ListRenderItem<DropdownOption> = ({ item }) => (
//     <TouchableOpacity
//       style={styles.optionItem}
//       onPress={() => handleSelect(item)}
//     >
//       <View style={styles.optionContent}>
//         <FontAwesome
//           name={item.icon}
//           size={20}
//           color="#333"
//           style={styles.optionIcon}
//         />
//         <Text style={styles.optionText}>{item.label}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <>
//       <TouchableOpacity
//         style={styles.dropdown}
//         onPress={() => setIsVisible(true)}
//       >
//         <View style={styles.selectedContent}>
//           {selectedOption ? (
//             <>
//               <AntDesign
//                 name={selectedOption.icon}
//                 size={20}
//                 color="white"
//                 style={styles.selectedIcon}
//               />
//               <Text style={styles.selectedText}>{selectedOption.label}</Text>
//             </>
//           ) : (
//             <Text style={styles.placeholderText}>{placeholder}</Text>
//           )}
//         </View>
//         <FontAwesome
//           name={isVisible ? "chevron-up" : "chevron-down"}
//           size={16}
//           color="white"
//         />
//       </TouchableOpacity>

//       <Modal
//         visible={isVisible}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={() => setIsVisible(false)}
//       >
//         <TouchableOpacity
//           style={styles.modalOverlay}
//           activeOpacity={1}
//           onPress={() => setIsVisible(false)}
//         >
//           <View style={styles.modalContent}>
//             <FlatList
//               data={options}
//               renderItem={renderOption}
//               keyExtractor={(item) => item.value}
//               showsVerticalScrollIndicator={false}
//             />
//           </View>
//         </TouchableOpacity>
//       </Modal>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#f5f5f5",
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//     color: "#333",
//   },
//   dropdown: {
//     backgroundColor: "#007AFF",
//     borderRadius: 8,
//     padding: 15,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   selectedContent: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//   },
//   selectedIcon: {
//     marginRight: 10,
//   },
//   selectedText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "500",
//   },
//   placeholderText: {
//     color: "rgba(255, 255, 255, 0.7)",
//     fontSize: 16,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContent: {
//     backgroundColor: "white",
//     borderRadius: 12,
//     width: "80%",
//     maxHeight: "50%",
//     elevation: 5,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//   },
//   optionItem: {
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },
//   optionContent: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   optionIcon: {
//     marginRight: 15,
//   },
//   optionText: {
//     fontSize: 16,
//     color: "#333",
//   },
//   result: {
//     fontSize: 16,
//     color: "#666",
//     textAlign: "center",
//   },
// });

// Types

export const CustomTypescriptDropdown: React.FC<CustomDropdownProps> = ({
  value,
  onValueChange,
  options,
  placeholder = "Select an option",
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const selectedOption = options.find((option) => option.value === value);

  const handleSelect = (option: DropdownOption): void => {
    onValueChange(option.value);
    setIsVisible(false);
  };

  const handleDropdownPress = (): void => {
    if (!disabled) {
      setIsVisible(true);
    }
  };

  const renderOption: ListRenderItem<DropdownOption> = ({ item }) => (
    <TouchableOpacity
      className="py-4 px-5 border-b border-gray-100 active:bg-gray-50"
      onPress={() => handleSelect(item)}
    >
      <View className="flex-row items-center">
        {/* <icon 
          name={item.icon} 
          size={20} 
          color="#374151" 
          style={{ marginRight: 15 }}
        /> */}
        {/* Use the icon prop as a component */}
        {React.createElement(item.iconType, {
          name: item.icon,
          size: 20,
          color: "#374151",
          style: { marginRight: 15 },
        })}
        <Text className="text-base text-gray-800 font-medium">
          {item.label}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity
        className={`
           rounded-lg p-4 flex-row justify-between items-center
          ${disabled ? "opacity-50" : ""}
        `}
        onPress={handleDropdownPress}
        disabled={disabled}
      >
        <View className="flex-row items-center flex-1">
          {selectedOption ? (
            <>
              {React.createElement(selectedOption.iconType, {
                name: selectedOption.icon,
                size: 20,
                color: "white",
                style: { marginRight: 15 },
              })}
              <Text className="text-white text-base font-medium">
                {selectedOption.label}
              </Text>
            </>
          ) : (
            <Text className="text-white/70 text-base">{placeholder}</Text>
          )}
        </View>
        <Entypo
          name={isVisible ? "chevron-thin-up" : "chevron-thin-down"}
          size={16}
          color="white"
        />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-center items-center"
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View className="bg-white rounded-xl w-[245px] max-h-1/2 shadow-lg">
            <FlatList
              data={options}
              renderItem={renderOption}
              keyExtractor={(item) => item.value}
              showsVerticalScrollIndicator={false}
              className="rounded-xl"
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

// Usage Example
// const App: React.FC = () => {
//   const [selectedValue, setSelectedValue] = useState<string>('public');

//   const privacyOptions: DropdownOption[] = [
//     {
//       label: 'Public',
//       value: 'public',
//       icon: 'globe'
//     },
//     {
//       label: 'Private',
//       value: 'private',
//       icon: 'lock'
//     },
//     {
//       label: 'Friends Only',
//       value: 'friends',
//       icon: 'users'
//     }
//   ];

//   const handleValueChange = (value: string): void => {
//     setSelectedValue(value);
//   };

//   return (
//     <View className="flex-1 p-5 bg-gray-100">
//       <Text className="text-xl font-bold mb-3 text-gray-800">
//         Privacy Setting
//       </Text>

//       <CustomDropdown
//         value={selectedValue}
//         onValueChange={handleValueChange}
//         options={privacyOptions}
//         placeholder="Select privacy level"
//       />

//       <View className="mt-5 p-4 bg-white rounded-lg shadow-sm">
//         <Text className="text-base text-gray-600 text-center">
//           Selected: <Text className="font-semibold text-gray-800">{selectedValue}</Text>
//         </Text>
//       </View>

//       {/* Example with disabled state */}
//       <View className="mt-5">
//         <Text className="text-lg font-semibold mb-2 text-gray-800">
//           Disabled Example
//         </Text>
//         <CustomDropdown
//           value="private"
//           onValueChange={() => {}}
//           options={privacyOptions}
//           placeholder="This is disabled"
//           disabled={true}
//         />
//       </View>
//     </View>
//   );
// };

// export default App;
