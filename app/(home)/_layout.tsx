import { View, Text, StatusBar } from "react-native";
import React from "react";
import Layout from "@/components/Layout";
import { IconSymbol } from "@/app-example/components/ui/IconSymbol";
import { Tabs } from "expo-router";

const HomeLayout = () => {
  return (
    <>
      <Layout />
      <StatusBar barStyle="light-content" />
    </>
  );
};

export default HomeLayout;
