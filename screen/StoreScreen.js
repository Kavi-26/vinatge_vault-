import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { db } from "../firebaseConfig";
import { getDocs, collection } from "firebase/firestore";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 18 * 2 - 12) / 2;

const StoreScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productsCollection = await getDocs(collection(db, "products"));
        const productsData = productsCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const groupedCategories = productsData.reduce((acc, product) => {
          const { category } = product;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(product);
          return acc;
        }, {});

        const formattedCategories = Object.keys(groupedCategories).map(
          (key) => ({
            title: key,
            data: groupedCategories[key],
          })
        );

        setCategories(formattedCategories);
        setFilteredProducts(productsData);
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const allProducts = categories.flatMap((category) => category.data);
    const filtered = allProducts.filter((product) =>
      product.name?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleDetailView = (item) => {
    navigation.navigate("ProductDetails", { item });
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleDetailView(item)}
      style={styles.cardTouchable}
      activeOpacity={0.85}
    >
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <View style={styles.cardBody}>
          <Text style={styles.cardName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.cardPrice}>
            ₹{item.price?.toLocaleString() || item.price}
          </Text>
          <Text style={styles.cardAbout} numberOfLines={2}>
            {item.about}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F0F4FF" />

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Store</Text>
            <Text style={styles.headerSub}>
              {filteredProducts.length} product
              {filteredProducts.length !== 1 ? "s" : ""} available
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchWrap}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#9DA5B4" />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch("")}>
                <Ionicons name="close-circle" size={18} color="#C5CAE9" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {loading ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator size="large" color="#4F6DF5" />
            <Text style={styles.loaderText}>Loading products...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrap}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyWrap}>
                <View style={styles.emptyCircle}>
                  <Ionicons name="search-outline" size={40} color="#C5CAE9" />
                </View>
                <Text style={styles.emptyTitle}>No Results</Text>
                <Text style={styles.emptySub}>
                  Try a different search term.
                </Text>
              </View>
            }
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4FF",
  },
  header: {
    padding: 22,
    paddingTop: 15,
    paddingBottom: 10,
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0F1B4C",
  },
  headerSub: {
    fontSize: 13,
    color: "#999",
    marginTop: 2,
    fontWeight: "500",
  },

  // Search
  searchWrap: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E8ECF4",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F7FB",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E8ECF4",
    paddingHorizontal: 14,
    height: 46,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1a1a2e",
    fontWeight: "500",
    paddingVertical: 0,
  },

  // Loader
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

  // List
  listContent: {
    padding: 18,
    paddingBottom: 40,
  },
  columnWrap: {
    justifyContent: "space-between",
  },

  // Card
  cardTouchable: {
    width: CARD_WIDTH,
    marginBottom: 14,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#0F1B4C",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardImage: {
    width: "100%",
    height: CARD_WIDTH * 0.85,
    backgroundColor: "#EEF2FF",
    resizeMode: "cover",
  },
  cardBody: {
    padding: 12,
  },
  cardName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a1a2e",
  },
  cardPrice: {
    fontSize: 15,
    fontWeight: "800",
    color: "#4F6DF5",
    marginTop: 4,
  },
  cardAbout: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
    lineHeight: 15,
  },

  // Empty
  emptyWrap: {
    alignItems: "center",
    marginTop: 60,
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
  },
});

export default StoreScreen;
