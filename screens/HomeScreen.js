import { View, Text, Button } from "react-native";
import React from "react";
import useAuth from "../hooks/useAuth";

const HomeScreen = () => {
    const { logout } = useAuth();

    return (
        <View className="flex-1 justify-center items-center">
            <Text>Home Screen</Text>
            <Button title="Logout" onPress={logout} />
        </View>
    );
};

export default HomeScreen;  
