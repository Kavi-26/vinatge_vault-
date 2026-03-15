import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StatusBar,
  Dimensions,
} from "react-native";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");

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
        Alert.alert("Error", "There was an error fetching your data.");
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
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut(auth);
            // Navigation is handled automatically by onAuthStateChanged in App.js
          } catch (error) {
            Alert.alert("Oops", "Something went wrong!");
          }
        },
      },
    ]);
  };

  const navigateToAdmin = () => {
    navigation.navigate("AdminTabs");
  };

  const toggleItemDetails = (index) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    return parts.length > 1
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0][0].toUpperCase();
  };

  if (loading) {
    return (
      <View style={styles.loaderScreen}>
        <StatusBar barStyle="dark-content" backgroundColor="#F0F4FF" />
        <ActivityIndicator size="large" color="#4F6DF5" />
        <Text style={styles.loaderText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F1B4C" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />
          
          {user?.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.profileImage} />
          ) : (
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{getInitials(user?.displayName)}</Text>
            </View>
          )}
          <Text style={styles.userName}>{user?.displayName}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>

          {isAdmin && (
            <View style={styles.adminBadge}>
              <Ionicons name="shield-checkmark" size={12} color="#4F6DF5" />
              <Text style={styles.adminBadgeText}>Administrator</Text>
            </View>
          )}
        </View>

        {/* Stats Strip */}
        <View style={styles.statsStrip}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{shopHistory.length}</Text>
            <Text style={styles.statLabel}>Purchases</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{auctionHistory.length}</Text>
            <Text style={styles.statLabel}>Bids</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {isAdmin ? "Admin" : "User"}
            </Text>
            <Text style={styles.statLabel}>Role</Text>
          </View>
        </View>

        {/* Shop History Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={[styles.sectionIcon, { backgroundColor: "#E8F5E9" }]}>
                <Ionicons name="bag-check" size={16} color="#4CAF50" />
              </View>
              <Text style={styles.sectionTitle}>Shop History</Text>
            </View>
            <Text style={styles.sectionCount}>{shopHistory.length}</Text>
          </View>

          {shopHistory.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.historyCard}
              onPress={() => toggleItemDetails(index)}
              activeOpacity={0.7}
            >
              <View style={styles.historyTop}>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyName}>{item.itemName}</Text>
                  <Text style={styles.historyPrice}>{item.price}</Text>
                </View>
                <Ionicons
                  name={expandedItems[index] ? "chevron-up" : "chevron-down"}
                  size={18}
                  color="#999"
                />
              </View>
              {expandedItems[index] && (
                <View style={styles.historyDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar-outline" size={14} color="#999" />
                    <Text style={styles.detailText}>Purchased: {item.purchaseDate}</Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Auction History Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={[styles.sectionIcon, { backgroundColor: "#FFF3E0" }]}>
                <Ionicons name="hammer" size={16} color="#FF6D00" />
              </View>
              <Text style={styles.sectionTitle}>Auction History</Text>
            </View>
            <Text style={styles.sectionCount}>{auctionHistory.length}</Text>
          </View>

          {auctionHistory.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.historyCard}
              onPress={() => toggleItemDetails(index + shopHistory.length)}
              activeOpacity={0.7}
            >
              <View style={styles.historyTop}>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyName}>{item.auctionItem}</Text>
                  <Text style={styles.historyPrice}>{item.bidAmount}</Text>
                </View>
                <Ionicons
                  name={expandedItems[index + shopHistory.length] ? "chevron-up" : "chevron-down"}
                  size={18}
                  color="#999"
                />
              </View>
              {expandedItems[index + shopHistory.length] && (
                <View style={styles.historyDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar-outline" size={14} color="#999" />
                    <Text style={styles.detailText}>Bid Date: {item.bidDate}</Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.section}>
          {isAdmin && (
            <TouchableOpacity style={styles.adminBtn} onPress={navigateToAdmin} activeOpacity={0.85}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#fff" />
              <Text style={styles.adminBtnText}>Open Admin Panel</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.logoutBtn} onPress={onLogoutHandler} activeOpacity={0.85}>
            <Ionicons name="log-out-outline" size={20} color="#EF5350" />
            <Text style={styles.logoutBtnText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4FF",
  },
  loaderScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F4FF",
  },
  loaderText: {
    marginTop: 12,
    color: "#999",
    fontSize: 13,
    fontWeight: "500",
  },

  // Profile Header
  profileHeader: {
    backgroundColor: "#0F1B4C",
    paddingTop: 50,
    paddingBottom: 35,
    alignItems: "center",
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    overflow: "hidden",
  },
  decorCircle1: {
    position: "absolute",
    top: -20,
    right: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(79,109,245,0.12)",
  },
  decorCircle2: {
    position: "absolute",
    bottom: -15,
    left: -25,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(79,109,245,0.08)",
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
    marginBottom: 14,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#4F6DF5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.2)",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
  },
  userName: {
    fontSize: 24,
    fontWeight: "900",
    color: "#fff",
  },
  userEmail: {
    fontSize: 13,
    color: "rgba(255,255,255,0.55)",
    marginTop: 4,
    fontWeight: "500",
  },
  adminBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(79,109,245,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 12,
    gap: 5,
  },
  adminBadgeText: {
    color: "#8FA4FF",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Stats
  statsStrip: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 20,
    padding: 18,
    justifyContent: "space-around",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#0F1B4C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F1B4C",
  },
  statLabel: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
    fontWeight: "600",
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#E8ECF4",
  },

  // Section
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1a1a2e",
  },
  sectionCount: {
    fontSize: 13,
    fontWeight: "700",
    color: "#999",
  },

  // History Card
  historyCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#0F1B4C",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  historyTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyInfo: {
    flex: 1,
  },
  historyName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a2e",
  },
  historyPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4F6DF5",
    marginTop: 3,
  },
  historyDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F4FF",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: "#888",
    fontWeight: "500",
  },

  // Buttons
  adminBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4F6DF5",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    marginBottom: 12,
    elevation: 4,
    shadowColor: "#4F6DF5",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  adminBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
    flex: 1,
    textAlign: "center",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    borderWidth: 1.5,
    borderColor: "#FFCDD2",
  },
  logoutBtnText: {
    color: "#EF5350",
    fontSize: 15,
    fontWeight: "800",
  },
});

export default ProfileScreen;
