import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  StatusBar,
  Dimensions,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const { width } = Dimensions.get("window");

const AdminPage = ({ navigation }) => {
  const [stats, setStats] = useState({
    turnover: 0,
    productsSold: 0,
    totalProducts: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const ordersSnap = await getDocs(collection(db, "orders"));
      const productsSnap = await getDocs(collection(db, "products"));
      const usersSnap = await getDocs(collection(db, "users"));

      let totalTurnover = 0;
      ordersSnap.forEach((doc) => {
        totalTurnover += doc.data().totalPrice || 0;
      });

      setStats({
        turnover: totalTurnover,
        productsSold: ordersSnap.size,
        totalProducts: productsSnap.size,
        totalUsers: usersSnap.size,
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchStats();
    }, [])
  );

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut(auth);
          } catch (error) {
            Alert.alert("Error", "Failed to log out.");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loaderScreen}>
        <StatusBar barStyle="light-content" backgroundColor="#0F1B4C" />
        <ActivityIndicator size="large" color="#4F6DF5" />
        <Text style={styles.loaderText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F1B4C" />
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Good Evening,</Text>
              <Text style={styles.headerTitle}>Admin Panel</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerBtn} onPress={() => fetchStats()}>
                <Ionicons name="refresh-outline" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerBtn} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.headerDesc}>
            Store monitoring and management at a glance
          </Text>
        </View>

        {/* Revenue Card - overlapping header */}
        <View style={styles.revenueCardWrapper}>
          <View style={styles.revenueCard}>
            <View style={styles.revenueLeft}>
              <View style={styles.revenueIconBox}>
                <Ionicons name="trending-up" size={24} color="#fff" />
              </View>
              <View>
                <Text style={styles.revenueLabel}>Total Revenue</Text>
                <Text style={styles.revenueValue}>
                  ₹{stats.turnover.toLocaleString()}
                </Text>
              </View>
            </View>
            <View style={styles.revenueBadge}>
              <Ionicons name="arrow-up" size={14} color="#00C853" />
              <Text style={styles.revenueBadgeText}>+12%</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Overview</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { borderBottomColor: "#FFAB00" }]}>
              <View style={[styles.statIconCircle, { backgroundColor: "#FFF8E1" }]}>
                <Ionicons name="bag-check" size={22} color="#FFAB00" />
              </View>
              <Text style={styles.statValue}>{stats.productsSold}</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={[styles.statCard, { borderBottomColor: "#2979FF" }]}>
              <View style={[styles.statIconCircle, { backgroundColor: "#E3F2FD" }]}>
                <Ionicons name="cube" size={22} color="#2979FF" />
              </View>
              <Text style={styles.statValue}>{stats.totalProducts}</Text>
              <Text style={styles.statLabel}>Products</Text>
            </View>
            <View style={[styles.statCard, { borderBottomColor: "#AA00FF" }]}>
              <View style={[styles.statIconCircle, { backgroundColor: "#F3E5F5" }]}>
                <Ionicons name="people" size={22} color="#AA00FF" />
              </View>
              <Text style={styles.statValue}>{stats.totalUsers}</Text>
              <Text style={styles.statLabel}>Customers</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate("Add")}>
              <View style={[styles.actionCircle, { backgroundColor: "#E8F5E9" }]}>
                <Ionicons name="add-circle" size={26} color="#00C853" />
              </View>
              <Text style={styles.actionText}>Add Product</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate("Orders")}>
              <View style={[styles.actionCircle, { backgroundColor: "#FFF3E0" }]}>
                <Ionicons name="receipt" size={26} color="#FF6D00" />
              </View>
              <Text style={styles.actionText}>Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate("Users")}>
              <View style={[styles.actionCircle, { backgroundColor: "#E3F2FD" }]}>
                <Ionicons name="people" size={26} color="#2979FF" />
              </View>
              <Text style={styles.actionText}>Users</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate("Products")}>
              <View style={[styles.actionCircle, { backgroundColor: "#F3E5F5" }]}>
                <Ionicons name="grid" size={26} color="#AA00FF" />
              </View>
              <Text style={styles.actionText}>Products</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Info Banner */}
        <View style={styles.section}>
          <View style={styles.infoBanner}>
            <View style={styles.infoLeft}>
              <Ionicons name="information-circle" size={28} color="#4F6DF5" />
              <View style={styles.infoTextGroup}>
                <Text style={styles.infoTitle}>System Healthy</Text>
                <Text style={styles.infoDesc}>All services are running normally.</Text>
              </View>
            </View>
            <View style={styles.infoDot} />
          </View>
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
    marginTop: 15,
    fontSize: 14,
    color: "#888",
    fontWeight: "500",
  },

  // Header
  header: {
    backgroundColor: "#0F1B4C",
    paddingTop: 55,
    paddingBottom: 60,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 15,
    fontWeight: "500",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 0.5,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
    gap: 10,
  },
  headerBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerDesc: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 13,
    marginTop: 15,
    lineHeight: 18,
  },

  // Revenue Card
  revenueCardWrapper: {
    paddingHorizontal: 20,
    marginTop: -35,
  },
  revenueCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#0F1B4C",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  revenueLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  revenueIconBox: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#4F6DF5",
    justifyContent: "center",
    alignItems: "center",
  },
  revenueLabel: {
    fontSize: 12,
    color: "#999",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  revenueValue: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1a1a2e",
    marginTop: 2,
  },
  revenueBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 3,
  },
  revenueBadgeText: {
    color: "#00C853",
    fontSize: 13,
    fontWeight: "700",
  },

  // Sections
  section: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1a1a2e",
    marginBottom: 15,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    backgroundColor: "#fff",
    width: (width - 56) / 3,
    borderRadius: 20,
    paddingVertical: 20,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    borderBottomWidth: 3,
  },
  statIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1a1a2e",
  },
  statLabel: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
    fontWeight: "600",
  },

  // Quick Actions
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionItem: {
    alignItems: "center",
    width: (width - 60) / 4,
  },
  actionCircle: {
    width: 58,
    height: 58,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#555",
    textAlign: "center",
  },

  // Info Banner
  infoBanner: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E8FF",
  },
  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoTextGroup: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a1a2e",
  },
  infoDesc: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  infoDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#00C853",
  },
});

export default AdminPage;
