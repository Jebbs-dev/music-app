import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { GestureResponderEvent, TouchableOpacity } from 'react-native';

interface RoundedButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: (event: GestureResponderEvent) => void;
  className: string;
  color: string;
  iconType?: "ionicon" | "others";
  otherIcon?: React.ComponentType<any>;
}

const RoundedButton = ({ icon, onPress, className = "p-6", color, iconType, otherIcon}: RoundedButtonProps) => {

  return (
    <TouchableOpacity 
      onPress={onPress} 
      className={`${className} rounded-full justify-center items-center`}
      activeOpacity={0.7}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      {iconType === "ionicon" && <Ionicons name={icon} size={24} color={color} />}
      {iconType !== "ionicon" && otherIcon && React.createElement(otherIcon, { name: icon, size: 24, color })}
    </TouchableOpacity>
  )
}

export default RoundedButton