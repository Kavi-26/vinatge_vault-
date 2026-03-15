import React, { useEffect, useState } from "react";
import { View, Text, Alert, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [shopHistory, setShopHistory] = useState([]);
  const [auctionHistory, setAuctionHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

  const dummyShopHistory = [
    { itemName: "Antique Vase", purchaseDate: "2024-11-20", price: "₹12,000" },
    { itemName: "Vintage Clock", purchaseDate: "2024-10-10", price: "₹8,500" },
    { itemName: "Classic Painting", purchaseDate: "2024-09-05", price: "₹25,000" },
    { itemName: "Ancient Statue", purchaseDate: "2024-08-15", price: "₹45,000" },
  ];

  const dummyAuctionHistory = [
    { auctionItem: "Royal Rug", bidDate: "2024-11-25", bidAmount: "₹50,000" },
    { auctionItem: "Antique Sword", bidDate: "2024-10-15", bidAmount: "₹35,000" },
    { auctionItem: "Old Chair Set", bidDate: "2024-09-10", bidAmount: "₹18,000" },
    { auctionItem: "Vintage Mirror", bidDate: "2024-08-20", bidAmount: "₹28,000" },
  ];

  const fetchUserData = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const userData = {
          displayName: currentUser.displayName || "Anonymous",
          email: currentUser.email,
          photoURL: currentUser.photoURL || null,
        };

        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userDetails = userDoc.data();
          userData.displayName = userDetails.username || userData.displayName;
          setIsAdmin(userDetails.admin === true);
        }

        setUser(userData);
        setShopHistory(dummyShopHistory);
        setAuctionHistory(dummyAuctionHistory);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        Alert.alert("Error", "There was an error fetching your data. Please try again.");
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserData().finally(() => setRefreshing(false));
  };

  const onLogoutHandler = async () => {
    try {
      await signOut(auth);
      Alert.alert("Logout", "You have been logged out successfully!");
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Oops", "Something went wrong! Please try again.");
    }
  };

  const navigateToAdmin = () => {
    navigation.navigate("Admin");
  };

  const toggleItemDetails = (index) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#00B0FF" style={styles.spinner} />
      ) : (
        <>
          <View style={styles.profileContainer}>
            {user?.photoURL ? (
              <Image source={{ uri: user.photoURL }} style={styles.profileImage} />
            ) : (
              <Ionicons name="person-circle-outline" size={90} color="#ffffff" />
            )}
            <Text style={styles.userName}>{user?.displayName}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>

          <Text style={styles.historyTitle}>Shop History</Text>
          <ScrollView
            style={styles.historyList}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          >
            {shopHistory.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.historyCard}
                onPress={() => toggleItemDetails(index)}
              >
                <View style={styles.historyCardHeader}>
                  <Text style={styles.historyCardTitle}>{item.itemName}</Text>
                  <Ionicons
                    name={expandedItems[index] ? "chevron-up-outline" : "chevron-down-outline"}
                    size={20}
                    color="#333"
                  />
                </View>
                {expandedItems[index] && (
                  <>
                    <Text style={styles.historyCardText}>Purchased on: {item.purchaseDate}</Text>
                    <Text style={styles.historyCardText}>Price: {item.price}</Text>
                  </>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.historyTitle}>Auction History</Text>
          <ScrollView
            style={styles.historyList}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          >
            {auctionHistory.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.historyCard}
                onPress={() => toggleItemDetails(index + shopHistory.length)}
              >
                <View style={styles.historyCardHeader}>
                  <Text style={styles.historyCardTitle}>{item.auctionItem}</Text>
                  <Ionicons
                    name={expandedItems[index + shopHistory.length] ? "chevron-up-outline" : "chevron-down-outline"}
                    size={20}
                    color="#333"
                  />
                </View>
                {expandedItems[index + shopHistory.length] && (
                  <>
                    <Text style={styles.historyCardText}>Bid Date: {item.bidDate}</Text>
                    <Text style={styles.historyCardText}>Bid Amount: {item.bidAmount}</Text>
                  </>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          {isAdmin && (
            <TouchableOpacity style={styles.adminButton} onPress={navigateToAdmin}>
              <Ionicons name="shield-checkmark-outline" size={24} color="#fff" />
              <Text style={styles.adminButtonText}>Admin Panel</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.logoutButton} onPress={onLogoutHandler}>
            <Ionicons name="log-out-outline" size={24} color="#fff" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F7FA",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1F2A44",
    marginBottom: 8,
    textAlign: "center",
    fontFamily: "Arial",
  },
  profileContainer: {
    alignItems: "center",
    backgroundColor: "#00B0FF",
    padding: 4,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  profileImage: {
    width: 500,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 26,
    fontWeight: "600",
    color: "#ffffff",
  },
  email: {
    fontSize: 16,
    color: "#e0e0e0",
  },
  historyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 12,
    marginLeft: 10,
  },
  historyList: {
    marginBottom: 20,
  },
  historyCard: {
    backgroundColor: "#ffffff",
    padding: 18,
    marginBottom: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginHorizontal: 20,
    borderLeftWidth: 6,
    borderLeftColor: "#00B0FF",
  },
  historyCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2A44",
  },
  historyCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  adminButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF5722",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginTop: 20,
  },
  adminButtonText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 10,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00B0FF",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginTop: 20,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 10,
  },
  spinner: {
    marginTop: 50,
  },
});

export default ProfileScreen;
