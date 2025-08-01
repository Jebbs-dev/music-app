import { useLoginUser } from "@/modules/music/mutations/login-user";
import { useSignupUser } from "@/modules/music/mutations/signup-user";
import useAuthStore from "@/store/auth-store";
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

// Zod validation schemas
const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

const Auth = () => {
  const { authView, setAuthView } = useAuthStore();
  
  const [loginFormData, setLoginFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  
  const [signupFormData, setSignupFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
  });
  
  const [loginErrors, setLoginErrors] = useState<Partial<LoginFormData>>({});
  const [signupErrors, setSignupErrors] = useState<Partial<SignupFormData>>({});
  const [loginTouched, setLoginTouched] = useState<Partial<Record<keyof LoginFormData, boolean>>>({});
  const [signupTouched, setSignupTouched] = useState<Partial<Record<keyof SignupFormData, boolean>>>({});

  const loginMutation = useLoginUser();
  const signupMutation = useSignupUser();

  const validateField = (schema: typeof loginSchema | typeof signupSchema, field: string, value: string) => {
    try {
      schema.shape[field as keyof typeof schema.shape].parse(value);
      return "";
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return error.issues[0]?.message || "";
      }
      return "";
    }
  };

  const handleLoginFieldChange = (field: keyof LoginFormData, value: string) => {
    setLoginFormData((prev) => ({ ...prev, [field]: value }));
    if (loginErrors[field]) {
      setLoginErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSignupFieldChange = (field: keyof SignupFormData, value: string) => {
    setSignupFormData((prev) => ({ ...prev, [field]: value }));
    if (signupErrors[field]) {
      setSignupErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleLoginFieldBlur = (field: keyof LoginFormData) => {
    setLoginTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(loginSchema, field, loginFormData[field] || "");
    setLoginErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSignupFieldBlur = (field: keyof SignupFormData) => {
    setSignupTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(signupSchema, field, signupFormData[field] || "");
    setSignupErrors((prev) => ({ ...prev, [field]: error }));
  };

  const validateLoginForm = (): boolean => {
    try {
      loginSchema.parse(loginFormData);
      setLoginErrors({});
      return true;
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<LoginFormData> = {};
        error.issues.forEach((err: z.ZodIssue) => {
          const field = err.path[0] as keyof LoginFormData;
          newErrors[field] = err.message;
        });
        setLoginErrors(newErrors);
        setLoginTouched({ email: true, password: true });
      }
      return false;
    }
  };

  const validateSignupForm = (): boolean => {
    try {
      signupSchema.parse(signupFormData);
      setSignupErrors({});
      return true;
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<SignupFormData> = {};
        error.issues.forEach((err: z.ZodIssue) => {
          const field = err.path[0] as keyof SignupFormData;
          newErrors[field] = err.message;
        });
        setSignupErrors(newErrors);
        setSignupTouched({ name: true, email: true, password: true });
      }
      return false;
    }
  };

  const handleLoginSubmit = async () => {
    if (!validateLoginForm()) return;

    try {
      

      await loginMutation.mutateAsync(loginFormData);
      router.replace("/(home)");
    } catch (error: any) {
      Alert.alert(
        "Login Failed",
        error?.response?.data?.message || "An error occurred during login. Please try again."
      );
    }
  };

  const handleSignupSubmit = async () => {
    if (!validateSignupForm()) return;

    try {
      console.log(signupFormData);

      await signupMutation.mutateAsync(signupFormData);
      // After successful signup, switch to login view
      setAuthView("login");
    } catch (error: any) {
      Alert.alert(
        "Signup Failed",
        error?.response?.data?.message || "An error occurred during signup. Please try again."
      );
    }
  };

  const isLoginFormValid = loginFormData.email && loginFormData.password && !loginErrors.email && !loginErrors.password;
  const isSignupFormValid = signupFormData.name && signupFormData.email && signupFormData.password && 
    !signupErrors.name && !signupErrors.email && !signupErrors.password;

  const renderLoginForm = () => (
    <View className="shadow-sm shadow-stone-900 bg-stone-800/50 rounded-3xl w-[80%] flex flex-col items-center px-5 py-12">
      <Text className="text-white text-2xl font-bold">Login</Text>

      <View className="w-full flex flex-col items-center mt-7 gap-5">
        <View className="w-[90%] flex flex-col gap-1">
          <Text className="text-white font-semibold text-xl">Email</Text>
          <TextInput
            placeholder="Enter your email"
            placeholderTextColor="#9CA3AF"
            textContentType="emailAddress"
            keyboardType="email-address"
            autoCapitalize="none"
            className={`border px-3 py-4 rounded-md text-white ${
              loginTouched.email && loginErrors.email 
                ? "border-red-500" 
                : "border-gray-300"
            }`}
            onChangeText={(value) => handleLoginFieldChange("email", value)}
            onBlur={() => handleLoginFieldBlur("email")}
            value={loginFormData.email}
          />
          {loginTouched.email && loginErrors.email && (
            <Text className="text-red-400 text-sm mt-1">{loginErrors.email}</Text>
          )}
        </View>

        <View className="w-[90%] flex flex-col gap-1">
          <Text className="text-white font-semibold text-xl">Password</Text>
          <TextInput
            placeholder="Enter your password"
            placeholderTextColor="#9CA3AF"
            className={`border px-3 py-4 rounded-md text-white ${
              loginTouched.password && loginErrors.password 
                ? "border-red-500" 
                : "border-gray-300"
            }`}
            onChangeText={(value) => handleLoginFieldChange("password", value)}
            onBlur={() => handleLoginFieldBlur("password")}
            value={loginFormData.password}
            secureTextEntry
          />
          {loginTouched.password && loginErrors.password && (
            <Text className="text-red-400 text-sm mt-1">{loginErrors.password}</Text>
          )}
        </View>

        <TouchableOpacity
          className={`w-[90%] py-4 rounded-md mt-2 ${
            isLoginFormValid && !loginMutation.isPending
              ? "bg-white"
              : "bg-gray-500"
          }`}
          onPress={handleLoginSubmit}
          disabled={!isLoginFormValid || loginMutation.isPending}
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

        <View className="flex flex-row items-center gap-2 mt-4">
          <Text className="text-gray-300">Don&apos;t have an account?</Text>
          <TouchableOpacity onPress={() => setAuthView("signup")}>
            <Text className="text-white font-semibold">Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderSignupForm = () => (
    <View className="shadow-sm shadow-stone-900  bg-stone-800/50 rounded-3xl  w-[80%] flex flex-col items-center px-5 py-12">
      <Text className="text-white text-2xl font-bold">Sign Up</Text>

      <View className="w-full flex flex-col items-center mt-7 gap-5">
        <View className="w-[90%] flex flex-col gap-1">
          <Text className="text-white font-semibold text-xl">Name</Text>
          <TextInput
            placeholder="Enter your name"
            placeholderTextColor="#9CA3AF"
            textContentType="givenName"
            keyboardType="default"
            autoCapitalize="words"
            className={`border px-3 py-4 rounded-md text-white ${
              signupTouched.name && signupErrors.name 
                ? "border-red-500" 
                : "border-gray-300"
            }`}
            onChangeText={(value) => handleSignupFieldChange("name", value)}
            onBlur={() => handleSignupFieldBlur("name")}
            value={signupFormData.name}
          />
          {signupTouched.name && signupErrors.name && (
            <Text className="text-red-400 text-sm mt-1">{signupErrors.name}</Text>
          )}
        </View>

        <View className="w-[90%] flex flex-col gap-1">
          <Text className="text-white font-semibold text-xl">Email</Text>
          <TextInput
            placeholder="Enter your email"
            placeholderTextColor="#9CA3AF"
            textContentType="emailAddress"
            keyboardType="email-address"
            autoCapitalize="none"
            className={`border px-3 py-4 rounded-md text-white ${
              signupTouched.email && signupErrors.email 
                ? "border-red-500" 
                : "border-gray-300"
            }`}
            onChangeText={(value) => handleSignupFieldChange("email", value)}
            onBlur={() => handleSignupFieldBlur("email")}
            value={signupFormData.email}
          />
          {signupTouched.email && signupErrors.email && (
            <Text className="text-red-400 text-sm mt-1">{signupErrors.email}</Text>
          )}
        </View>

        <View className="w-[90%] flex flex-col gap-1">
          <Text className="text-white font-semibold text-xl">Password</Text>
          <TextInput
            placeholder="Enter your password"
            placeholderTextColor="#9CA3AF"
            className={`border px-3 py-4 rounded-md text-white ${
              signupTouched.password && signupErrors.password 
                ? "border-red-500" 
                : "border-gray-300"
            }`}
            onChangeText={(value) => handleSignupFieldChange("password", value)}
            onBlur={() => handleSignupFieldBlur("password")}
            value={signupFormData.password}
            secureTextEntry
          />
          {signupTouched.password && signupErrors.password && (
            <Text className="text-red-400 text-sm mt-1">{signupErrors.password}</Text>
          )}
        </View>

        <TouchableOpacity
          className={`w-[90%] py-4 rounded-md mt-2 ${
            isSignupFormValid && !signupMutation.isPending
              ? "bg-white"
              : "bg-gray-500"
          }`}
          onPress={handleSignupSubmit}
          disabled={!isSignupFormValid || signupMutation.isPending}
        >
          <Text className="text-center font-semibold text-lg">
            {signupMutation.isPending ? "Creating account..." : "Sign Up"}
          </Text>
        </TouchableOpacity>

        {signupMutation.isError && (
          <Text className="text-red-400 text-sm text-center mt-2">
            Signup failed. Please try again.
          </Text>
        )}

        <View className="flex flex-row items-center gap-2 mt-4">
          <Text className="text-gray-300">Already have an account?</Text>
          <TouchableOpacity onPress={() => setAuthView("login")}>
            <Text className="text-white font-semibold">Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

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
          <View className="h-full w-full absolute top-0 left-0 bg-black opacity-20" />
          <SafeAreaView className="flex items-center justify-center h-full w-full">
            {authView === "login" ? renderLoginForm() : renderSignupForm()}
          </SafeAreaView>
        </ImageBackground>
      </View>
    </LinearGradient>
  );
};

export default Auth; 