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
  StatusBar,
  Dimensions,
  TextInput,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { db } from "../firebaseConfig";
import { collection, getDocs, deleteDoc, doc, query } from "firebase/firestore";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");

const ManageProducts = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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
      setFilteredProducts(productList);
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

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((p) =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

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
    <View style={styles.card}>
      <View style={styles.imageOverlay}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        {item.category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        )}
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardInfo}>
          <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.productPrice}>₹{item.price?.toLocaleString() || "0"}</Text>
          </View>
          <View style={styles.stockBadge}>
            <View style={styles.stockDot} />
            <Text style={styles.stockText}>In Stock</Text>
          </View>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Add", { product: item })}
            style={styles.editBtn}
          >
            <Ionicons name="create-outline" size={18} color="#4F6DF5" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={18} color="#EF5350" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F4FF" />
      
      {/* Header Overlay Style */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Inventory</Text>
          <Text style={styles.headerSub}>
            {products.length} product{products.length !== 1 ? "s" : ""} in catalog
          </Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate("Add")}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#999" />
          <TextInput
            placeholder="Search catalog..."
            placeholderTextColor="#999"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color="#ccc" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#4F6DF5" />
          <Text style={styles.loaderText}>Syncing inventory...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={renderProductItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <View style={styles.emptyCircle}>
                <Ionicons name="search-outline" size={40} color="#C5CAE9" />
              </View>
              <Text style={styles.emptyTitle}>
                {searchQuery !== "" ? "No matches found" : "No products yet"}
              </Text>
              <Text style={styles.emptySub}>
                {searchQuery !== "" 
                  ? "Try searching for something else" 
                  : "Start by adding items to your vault"}
              </Text>
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
    backgroundColor: "#F0F4FF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 22,
    paddingTop: 15,
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#0F1B4C",
  },
  headerSub: {
    fontSize: 13,
    color: "#999",
    marginTop: 2,
    fontWeight: "500",
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#0F1B4C",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#0F1B4C",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  searchContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F4FF",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F7FB",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 46,
    borderWidth: 1,
    borderColor: "#E8ECF4",
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#1a1a2e",
    fontWeight: "500",
  },
  loaderWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    marginTop: 12,
    color: "#999",
    fontSize: 13,
    fontWeight: "500",
  },
  listContent: {
    padding: 18,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#0F1B4C",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  imageOverlay: {
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: 160,
    backgroundColor: "#EEF2FF",
    resizeMode: "cover",
  },
  categoryBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(15, 27, 76, 0.85)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  categoryText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardBody: {
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1a1a2e",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 6,
  },
  priceLabel: {
    fontSize: 10,
    color: "#999",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  productPrice: {
    fontSize: 16,
    color: "#4F6DF5",
    fontWeight: "800",
  },
  stockBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: 10,
    gap: 6,
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4CAF50",
  },
  stockText: {
    color: "#4CAF50",
    fontSize: 11,
    fontWeight: "700",
  },
  cardActions: {
    gap: 10,
  },
  editBtn: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: "#F0F4FF",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteBtn: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: "#FFF5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyWrap: {
    alignItems: "center",
    marginTop: 80,
  },
  emptyCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1a1a2e",
  },
  emptySub: {
    fontSize: 13,
    color: "#999",
    marginTop: 4,
    textAlign: "center",
    paddingHorizontal: 40,
  },
});

export default ManageProducts;
