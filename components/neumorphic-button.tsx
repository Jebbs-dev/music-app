import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { GestureResponderEvent, TouchableOpacity } from 'react-native';

interface NeumorphicButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: (event: GestureResponderEvent) => void;
  className: string;
}

const NeumorphicButton = ({ icon, onPress, className = "p-6"}: NeumorphicButtonProps) => {

  return (
    <TouchableOpacity 
      onPress={onPress} 
      className={`${className} rounded-full border-2 border-[#2a2d2fcd] shadow-inner shadow-gray-800 justify-center items-center`}
      activeOpacity={0.7}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Ionicons name={icon} size={24} color="#ccc" />
    </TouchableOpacity>
  )
}

export default NeumorphicButton