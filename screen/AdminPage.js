import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { collection, getDocs, query } from "firebase/firestore";

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

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <View style={[styles.statCardWide, { borderLeftColor: color }]}>
      <View style={[styles.statIconContainer, { backgroundColor: color + "15" }]}>
        <Ionicons name={icon} size={32} color={color} />
      </View>
      <View style={styles.statTextContainer}>
        <Text style={styles.statLabel}>{title}</Text>
        <Text style={styles.statValue}>₹{value.toLocaleString()}</Text>
        <Text style={styles.statSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward-outline" size={20} color="#ccc" />
    </View>
  );

  const MiniStatCard = ({ title, value, icon, color }) => (
    <View style={styles.miniCard}>
      <View style={[styles.miniIconBox, { backgroundColor: color + "15" }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={styles.miniValue}>{value}</Text>
      <Text style={styles.miniLabel}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerBackground}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.welcomeText}>Welcome Back,</Text>
              <Text style={styles.title}>Admin Panel</Text>
            </View>
            <TouchableOpacity onPress={handleLogout} style={styles.headerIconBtn}>
              <Ionicons name="log-out-outline" size={26} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.headerSub}>
            <Text style={styles.subtitle}>Store monitoring and management at a glance</Text>
          </View>
        </View>

        <View style={styles.contentWrapper}>
          {loading ? (
            <ActivityIndicator size="large" color="#1B3BBB" style={styles.loader} />
          ) : (
            <>
              <Text style={styles.sectionTitle}>Financial Summary</Text>
              <StatCard 
                title="Total Turnover" 
                value={stats.turnover} 
                icon="cash-outline" 
                color="#00C853" 
                subtitle="+12% from last month"
              />

              <Text style={styles.sectionTitle}>Operational Stats</Text>
              <View style={styles.grid}>
                <MiniStatCard 
                  title="Completed" 
                  value={stats.productsSold} 
                  icon="bag-check-outline" 
                  color="#FFAB00" 
                />
                <MiniStatCard 
                  title="Inventory" 
                  value={stats.totalProducts} 
                  icon="layers-outline" 
                  color="#0091EA" 
                />
                <MiniStatCard 
                  title="Customers" 
                  value={stats.totalUsers} 
                  icon="people-outline" 
                  color="#AA00FF" 
                />
              </View>

              <View style={styles.actionCard}>
                <View style={styles.actionInfo}>
                  <Text style={styles.actionTitle}>Need Help?</Text>
                  <Text style={styles.actionDesc}>Check the documentation for system usage.</Text>
                </View>
                <TouchableOpacity style={styles.actionBtn}>
                  <Text style={styles.actionBtnText}>View Docs</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F4F7FE",
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerBackground: {
    backgroundColor: "#1B3BBB",
    paddingTop: 60,
    paddingBottom: 80,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 16,
    fontWeight: "500",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.5,
  },
  headerSub: {
    marginTop: 15,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 20,
  },
  headerIconBtn: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  contentWrapper: {
    paddingHorizontal: 20,
    marginTop: -40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 15,
    marginTop: 25,
  },
  loader: {
    marginTop: 100,
  },
  statCardWide: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderLeftWidth: 6,
    elevation: 8,
    shadowColor: "#1B3BBB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  statIconContainer: {
    width: 55,
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  statTextContainer: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: "#888",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 2,
  },
  statSubtitle: {
    fontSize: 12,
    color: "#00C853",
    fontWeight: "600",
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  miniCard: {
    backgroundColor: "#fff",
    width: "31%",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  miniIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  miniValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#333",
  },
  miniLabel: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
    fontWeight: "600",
  },
  actionCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#E0E5F2",
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  actionDesc: {
    fontSize: 12,
    color: "#777",
    marginTop: 3,
  },
  actionBtn: {
    backgroundColor: "#1B3BBB",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
  },
  actionBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
});

export default AdminPage;
