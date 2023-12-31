import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { View, Text, Button, TouchableOpacity, Image, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import useAuth from "../hooks/useAuth";
import Swiper from "react-native-deck-swiper";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    query,
    setDoc,
    where,
} from "firebase/firestore";
import { db, timestamp } from "../firebase";
import generateId from "../lib/generateId";

const DUMMY_DATA = [
    {
        displayName: "Elon Musk",
        job: "Software Engineer",
        photoURL:
            "https://upload.wikimedia.org/wikipedia/commons/9/99/Elon_Musk_Colorado_2022_%28cropped2%29.jpg",
        age: 23,
        id: 1,
    },
    {
        displayName: "Mark Zuckerberg",
        job: "Programmer",
        photoURL:
            "https://upload.wikimedia.org/wikipedia/commons/1/18/Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg",
        age: 39,
        id: 2,
    },
    {
        displayName: "Justin Mateen",
        job: "Software Developer",
        photoURL: "https://i.insider.com/606730e3856cd700198a2dd1?width=1136&format=jpeg",
        age: 37,
        id: 3,
    },
];

const HomeScreen = () => {
    const { user, logout } = useAuth();
    const [profiles, setProfiles] = useState([]);

    const navigation = useNavigation();
    const swipeRef = useRef();

    useLayoutEffect(() => {
        getDoc(doc(db, "users", user.uid)).then((data) => {
            if (!data.exists()) {
                navigation.navigate("Modal");
            }
        });
    }, []);

    useEffect(() => {
        let unsubscribe;

        const fetchCards = async () => {
            //comes after doing passes in swipeleft

            const passes = await getDocs(collection(db, "users", user.uid, "passes")).then(
                (snapShot) => snapShot.docs.map((doc) => doc.id)
            );

            // console.log(passes);

            const swipes = await getDocs(collection(db, "users", user.uid, "swipes")).then(
                (snapShot) => snapShot.docs.map((doc) => doc.id)
            );

            const passedUserIds = passes.length > 0 ? passes : ["temp"];
            const swipedUserIds = swipes.length > 0 ? swipes : ["temp"];

            unsubscribe = onSnapshot(
                query(
                    collection(db, "users"),
                    where("id", "not-in", [...passedUserIds, ...swipedUserIds])
                ),
                (snapShot) => {
                    setProfiles(
                        snapShot.docs
                            .filter((doc) => doc.id !== user.uid)
                            .map((doc) => ({
                                id: doc.id,
                                ...doc.data(),
                            }))
                    );
                }
            );
        };
        fetchCards();

        return unsubscribe;
    });

    const swipeLeft = (cardIndex) => {
        if (!profiles[cardIndex]) {
            return;
        }

        const userSwiped = profiles[cardIndex];
        setDoc(doc(db, "users", user.uid, "passes", userSwiped.id), userSwiped);
    };

    const swipeRight = async (cardIndex) => {
        try {
            if (!profiles[cardIndex]) {
                return;
            }

            const userSwiped = profiles[cardIndex];
            const loggedInProfile = await (await getDoc(doc(db, "users", user.uid))).data();

            // console.log("loggedInProfile", loggedInProfile);

            getDoc(doc(db, "users", userSwiped.id, "swipes", user.uid)).then((docSnap) => {
                if (docSnap.exists()) {
                    setDoc(doc(db, "users", user.uid, "swipes", userSwiped.id), userSwiped);
                    setDoc(doc(db, "matches", generateId(user.uid, userSwiped.id)), {
                        users: {
                            [user.uid]: loggedInProfile,
                            [userSwiped.id]: userSwiped,
                        },
                        usersMatched: [user.uid, userSwiped.id],
                        // timestamp: timestamp,
                    });

                    console.log(loggedInProfile, userSwiped);

                    navigation.navigate("Match", {
                        loggedInProfile,
                        userSwiped,
                    });
                } else {
                    setDoc(doc(db, "users", user.uid, "swipes", userSwiped.id), userSwiped);
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <SafeAreaView className="flex-1 pt-6">
            {/* Navigation */}
            <View className="flex-row items-center justify-between px-5">
                <TouchableOpacity onPress={logout}>
                    <Image
                        className="h-10 w-10 rounded-full"
                        source={{
                            uri: "https://img.freepik.com/free-icon/user_318-159711.jpg",
                        }}
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
                    <Image className="h-14 w-14" source={require("../assets/logo.png")} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
                    <Ionicons name="chatbubbles-sharp" size={30} color="#FF5864" />
                </TouchableOpacity>
            </View>

            {/* Profile Swiper */}
            <View className="flex-1 -mt-6">
                <Swiper
                    ref={swipeRef}
                    containerStyle={{
                        backgroundColor: "transparent",
                    }}
                    cards={profiles}
                    stackSize={5}
                    cardIndex={0}
                    animateCardOpacity
                    verticalSwipe={false}
                    onSwipedLeft={(index) => {
                        console.log("Swipe Pass");
                        swipeLeft(index);
                    }}
                    onSwipedRight={(index) => {
                        console.log("Swipe Match");
                        swipeRight(index);
                    }}
                    backgroundColor="#4FD0E9"
                    overlayLabels={{
                        left: {
                            title: "SKIP",
                            style: {
                                label: {
                                    textAlign: "right",
                                    color: "red",
                                },
                            },
                        },
                        right: {
                            title: "MATCH",
                            style: {
                                label: {
                                    color: "#4DED30",
                                },
                            },
                        },
                    }}
                    renderCard={(card) => {
                        return card ? (
                            <View key={card.id} className="bg-white h-3/4 rounded-xl relative">
                                <Image
                                    className="absolute top-0 h-full w-full rounded-xl"
                                    source={{ uri: card.photoURL }}
                                />

                                <View className="absolute bottom-0 bg-white w-full h-20 justify-between items-center flex-row px-6 py-2 rounded-b-xl shadow-xl">
                                    <View>
                                        <Text className="text-xl font-bold">
                                            {card.displayName}
                                        </Text>
                                        <Text>{card.job}</Text>
                                    </View>
                                    <Text className="text-2xl font-bold">{card.age}</Text>
                                </View>
                            </View>
                        ) : (
                            <View className="relative bg-white h-3/4 rounded-xl justify-center items-center shadow-xl">
                                <Text className="font-bold pb-5">No more profiles</Text>
                                <Image
                                    className="h-20 w-20"
                                    height={100}
                                    width={100}
                                    source={{
                                        uri: "https://cdn.shopify.com/s/files/1/1061/1924/products/Crying_Face_Emoji_large.png?v=1571606037",
                                    }}
                                />
                            </View>
                        );
                    }}
                />
            </View>

            {/* Buttons */}
            <View className="flex flex-row justify-evenly pb-4">
                <TouchableOpacity
                    onPress={() => swipeRef.current.swipeLeft()}
                    className="items-center justify-center rounded-full w-16 h-16 bg-red-200"
                >
                    <Entypo name="cross" size={24} color="red" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => swipeRef.current.swipeRight()}
                    className="items-center justify-center rounded-full w-16 h-16 bg-green-200"
                >
                    <Entypo name="heart" size={24} color="green" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default HomeScreen;
