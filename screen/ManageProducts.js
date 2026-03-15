import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { db } from "../firebaseConfig";
import { collection, getDocs, deleteDoc, doc, query } from "firebase/firestore";
import Ionicons from "react-native-vector-icons/Ionicons";

const ManageProducts = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "products"));
      const querySnapshot = await getDocs(q);
      const productList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
    } catch (error) {
      console.error("Error fetching products:", error);
      Alert.alert("Error", "Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchProducts();
    }, [])
  );

  const handleDelete = (id) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this product?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "products", id));
            Alert.alert("Deleted", "Product removed successfully.");
            fetchProducts();
          } catch (error) {
            Alert.alert("Error", "Failed to delete product.");
          }
        },
      },
    ]);
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.productPrice}>₹{item.price.toLocaleString()}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>In Stock</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity 
          onPress={() => navigation.navigate("Add", { product: item })} 
          style={styles.editButton}
        >
          <Ionicons name="create-outline" size={22} color="#007BFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={22} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <Text style={styles.headerTitle}>Product Catalog</Text>
        <Text style={styles.headerSubtitle}>{products.length} Items Available</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#1B3BBB" style={styles.loader} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderProductItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="cube-outline" size={80} color="#ddd" />
              <Text style={styles.emptyText}>No products found.</Text>
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
    color: "#1B3BBB",
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
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  productImage: {
    width: 85,
    height: 85,
    borderRadius: 15,
    marginRight: 15,
    backgroundColor: "#F8FAFF",
  },
  productInfo: {
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  productPrice: {
    fontSize: 16,
    color: "#1B3BBB",
    fontWeight: "bold",
    marginTop: 4,
  },
  badge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  badgeText: {
    color: "#4CAF50",
    fontSize: 11,
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
    gap: 5,
  },
  editButton: {
    padding: 10,
    backgroundColor: "#F0F7FF",
    borderRadius: 12,
  },
  deleteButton: {
    padding: 10,
    backgroundColor: "#FFF2F2",
    borderRadius: 12,
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

export default ManageProducts;
