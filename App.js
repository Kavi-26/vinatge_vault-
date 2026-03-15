import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons"; // Icons for tab navigation

// Firebase
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";

// Screens
import Register from "./screen/Register";
import Login from "./screen/Login";
import HomeScreen from "./screen/HomeScreen"; // Import HomeScreen
import StoreScreen from "./screen/StoreScreen"; // Import StoreScreen
import AuctionScreen from "./screen/AuctionScreen"; // Import AuctionScreen
import ProfileScreen from "./screen/ProfileScreen"; // Import ProfileScreen
import ProductDetails from "./screen/ProductDetails";
import AuctionDetails from "./screen/AuctionDetails";
import AdminPage from "./screen/AdminPage"; // Import the AdminPage component
import ProductDetailsScreen from "./screen/ProductDetailsScreen";
import OrderPlacedScreen from "./screen/OrderPlacedScreen";
// Stack Navigator
const Stack = createStackNavigator();
// Tab Navigator
const Tab = createBottomTabNavigator();

// Tab Navigator Component
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Store") {
            iconName = focused ? "cart" : "cart-outline";
          } else if (route.name === "Auction") {
            iconName = focused ? "pricetag" : "pricetag-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "black", // Black color for active icons
        tabBarInactiveTintColor: "black", // Black color for inactive icons
        tabBarStyle: {
          backgroundColor: "white", // Optional: Keep the tab bar white for contrast
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Store" component={StoreScreen} />
      <Tab.Screen name="Auction" component={AuctionScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Main App Component
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator>
          {!user ? (
            <>
              <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="Register"
                component={Register}
                options={{ headerShown: true }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="Home1"
                component={TabNavigator} // Use TabNavigator here
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ProductDetails"
                component={ProductDetails} 
                options={{ headerShown: true }}
                />
              <Stack.Screen
                name="AuctionDetails"
                component={AuctionDetails} 
                options={{ headerShown: true }}
                />
                <Stack.Screen
                name="ProductDetailsScreen"
                component={ProductDetailsScreen} 
                options={{ headerShown: true }}
                />
                <Stack.Screen
                name="OrderPlaced"
                component={OrderPlacedScreen} 
                options={{ headerShown: true }}
                />
                <Stack.Screen
                 name="Admin"
                 component={AdminPage}
                 options={{headerShown: true}}
                />

            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 60,
  },
});




