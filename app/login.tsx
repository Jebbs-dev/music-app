import { useLoginUser } from "@/modules/music/mutations/login-user";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ImageBackground,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";
import NewBg from "../assets/images/new/new-bg.jpg";

// Zod validation schema
const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof LoginFormData, boolean>>>({});

  const loginMutation = useLoginUser();

  const validateField = (field: keyof LoginFormData, value: string) => {
    try {
      loginSchema.shape[field].parse(value);
      return "";
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return error.issues[0]?.message || "";
      }
      return "";
    }
  };

  const handleFieldChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFieldBlur = (field: keyof LoginFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const validateForm = (): boolean => {
    try {
      loginSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<LoginFormData> = {};
        error.issues.forEach((err: z.ZodIssue) => {
          const field = err.path[0] as keyof LoginFormData;
          newErrors[field] = err.message;
        });
        setErrors(newErrors);
        setTouched({ email: true, password: true });
      }
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await loginMutation.mutateAsync(formData);
      // Navigate to home on successful login
      router.replace("/(home)");
    } catch (error: any) {
      Alert.alert(
        "Login Failed",
        error?.response?.data?.message || "An error occurred during login. Please try again."
      );
    }
  };

  const isFormValid = formData.email && formData.password && !errors.email && !errors.password;

  return (
    <LinearGradient
      colors={["#181818", "#000000"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View className="h-full">
        <ImageBackground
          source={NewBg}
          className="h-full w-full flex items-center justify-center bg-opacity-50"
        >
          <View className="h-full w-full absolute top-0 left-0 bg-black opacity-50" />
          <SafeAreaView className="flex items-center justify-center h-full w-full">
            <View className="shadow-sm shadow-stone-900 bg-stone-800 rounded-lg w-[80%] flex flex-col items-center px-5 py-12">
              <Text className="text-white text-2xl font-bold">Login</Text>

              <View className="w-full flex flex-col items-center mt-7 gap-5">
                <View className="w-[90%] flex flex-col gap-1">
                  <Text className="text-white font-semibold text-xl">
                    Email
                  </Text>
                  <TextInput
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA3AF"
                    textContentType="emailAddress"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className={`border px-3 py-4 rounded-md text-white ${
                      touched.email && errors.email 
                        ? "border-red-500" 
                        : "border-gray-300"
                    }`}
                    onChangeText={(value) => handleFieldChange("email", value)}
                    onBlur={() => handleFieldBlur("email")}
                    value={formData.email}
                  />
                  {touched.email && errors.email && (
                    <Text className="text-red-400 text-sm mt-1">
                      {errors.email}
                    </Text>
                  )}
                </View>

                <View className="w-[90%] flex flex-col gap-1">
                  <Text className="text-white font-semibold text-xl">
                    Password
                  </Text>
                  <TextInput
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    className={`border px-3 py-4 rounded-md text-white ${
                      touched.password && errors.password 
                        ? "border-red-500" 
                        : "border-gray-300"
                    }`}
                    onChangeText={(value) => handleFieldChange("password", value)}
                    onBlur={() => handleFieldBlur("password")}
                    value={formData.password}
                    secureTextEntry
                  />
                  {touched.password && errors.password && (
                    <Text className="text-red-400 text-sm mt-1">
                      {errors.password}
                    </Text>
                  )}
                </View>

                <TouchableOpacity
                  className={`w-[90%] py-4 rounded-md mt-2 ${
                    isFormValid && !loginMutation.isPending
                      ? "bg-white"
                      : "bg-gray-500"
                  }`}
                  onPress={handleSubmit}
                  disabled={!isFormValid || loginMutation.isPending}
                >
                  <Text className="text-center font-semibold text-lg">
                    {loginMutation.isPending ? "Logging in..." : "Login"}
                  </Text>
                </TouchableOpacity>

                {loginMutation.isError && (
                  <Text className="text-red-400 text-sm text-center mt-2">
                    Login failed. Please check your credentials and try again.
                  </Text>
                )}
              </View>
            </View>
          </SafeAreaView>
        </ImageBackground>
      </View>
    </LinearGradient>
  );
};

export default Login;
