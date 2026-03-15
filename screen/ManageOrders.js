import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { db } from "../firebaseConfig";
import { collection, getDocs, query } from "firebase/firestore";
import Ionicons from "react-native-vector-icons/Ionicons";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "orders"));
      const querySnapshot = await getDocs(q);
      const orderList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(orderList);
    } catch (error) {
      console.error("Error fetching orders:", error);
      Alert.alert("Error", "Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.idGroup}>
          <View style={styles.iconBox}>
            <Ionicons name="receipt" size={20} color="#9C27B0" />
          </View>
          <Text style={styles.orderId}>#{item.id.slice(-6).toUpperCase()}</Text>
        </View>
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Completed</Text>
        </View>
      </View>
      
      <View style={styles.orderBody}>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color="#777" />
          <Text style={styles.infoText}>
            {item.createdAt ? new Date(item.createdAt.toDate()).toLocaleDateString('en-IN', {
              day: '2-digit', month: 'short', year: 'numeric'
            }) : "N/A"}
          </Text>
        </View>
        <View style={styles.amountGroup}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.orderAmount}>₹{item.totalPrice.toLocaleString()}</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.detailsBtn}>
        <Text style={styles.detailsBtnText}>View Details</Text>
        <Ionicons name="arrow-forward" size={16} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <Text style={styles.headerTitle}>Order History</Text>
        <Text style={styles.headerSubtitle}>{orders.length} Total Transactions</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#9C27B0" style={styles.loader} />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={80} color="#ddd" />
              <Text style={styles.emptyText}>No orders placed yet.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FE",
  },
  headerArea: {
    padding: 25,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E5F2",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#9C27B0",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
  loader: {
    marginTop: 100,
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  idGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F3E5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4CAF50",
    marginRight: 6,
  },
  statusText: {
    color: "#4CAF50",
    fontSize: 12,
    fontWeight: "bold",
  },
  orderBody: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    fontWeight: "500",
  },
  amountGroup: {
    marginTop: 5,
  },
  totalLabel: {
    fontSize: 12,
    color: "#999",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  orderAmount: {
    fontSize: 22,
    fontWeight: "800",
    color: "#333",
    marginTop: 2,
  },
  detailsBtn: {
    backgroundColor: "#1B3BBB",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 15,
    marginTop: 5,
  },
  detailsBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    marginRight: 8,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 100,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    color: "#999",
    fontWeight: "500",
  },
});

export default ManageOrders;
