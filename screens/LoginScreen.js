import { View, Text, TextInput, TouchableOpacity, Alert, ImageBackground } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";

const LoginScreen = () => {
    const [type, setType] = useState(1); // 1 = login, 2 = register
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        setName("");
        setEmail("");
        setPassword("");
    }, [type]);

    const signIn = () => {
        console.log(email, password);
    };

    const signUp = () => {
        console.log(name, email, password);
    };

    return (
        <ImageBackground className="flex-1" source={require("../assets/bg.png")}>
            {type === 1 ? (
                // Login Screen
                <View className="flex-1 justify-center items-center">
                    <Text className="font-bold text-2xl">Sign In</Text>
                    <Text className="text-white font-semibold">Access to your account</Text>

                    <View className="w-full p-5">
                        {/* Email */}
                        <Text className="font-semibold pb-2 text-white">Email</Text>
                        <TextInput
                            keyboardType="email-address"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 mb-4"
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                        />

                        {/* Password */}
                        <Text className="font-semibold pb-2 text-white">Password</Text>
                        <TextInput
                            keyboardType="default"
                            secureTextEntry={true}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                        />

                        {/* Sign In Button */}
                        <TouchableOpacity
                            className="w-full rounded-lg mt-8 bg-black py-3"
                            onPress={signIn}
                        >
                            <Text className="text-center text-white font-bold">Sign In</Text>
                        </TouchableOpacity>

                        {/* Don't have an account */}
                        <TouchableOpacity onPress={() => setType(2)}>
                            <Text className="text-center text-gray-100 pt-3">
                                Don't have an account?
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                // Register Screen
                <View className="flex-1 justify-center items-center">
                    <Text className="font-bold text-2xl">Sign Up</Text>
                    <Text className="text-white">Create a new account</Text>

                    <View className="w-full p-5">
                        {/* Name */}
                        <Text className="font-semibold pb-2 text-white">Name</Text>
                        <TextInput
                            keyboardType="default"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 mb-4"
                            value={name}
                            onChangeText={(text) => setName(text)}
                        />

                        {/* Email */}
                        <Text className="font-semibold pb-2 text-white">Email</Text>
                        <TextInput
                            keyboardType="email-address"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 mb-4"
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            secureTextEntry={false}
                        />

                        {/* Password */}
                        <Text className="font-semibold pb-2 text-white">Password</Text>
                        <TextInput
                            secureTextEntry={true}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                        />

                        {/* Sign Up Button */}
                        <TouchableOpacity
                            className="w-full rounded-lg mt-8 bg-black py-3"
                            onPress={signUp}
                        >
                            <Text className="text-center text-white font-bold">Sign Up</Text>
                        </TouchableOpacity>

                        {/* Already have an account */}
                        <TouchableOpacity onPress={() => setType(1)}>
                            <Text className="text-center text-gray-100 pt-3">
                                Already have an account?
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </ImageBackground>
    );
};

export default LoginScreen;
