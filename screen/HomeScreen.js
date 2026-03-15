import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { db } from "../firebaseConfig";
import { getDocs, collection } from "firebase/firestore";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width: screenWidth } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRefs = useRef([]);
  const scrollPositions = useRef({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch products
        const productsCollection = await getDocs(collection(db, "dproducts"));
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

        // Fetch auctions
        const auctionCollection = await getDocs(collection(db, "auction pro"));
        const auctionData = auctionCollection.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAuctions(auctionData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      categories.forEach((category, index) => {
        const ref = scrollRefs.current[index];
        if (ref) {
          const currentIndex = scrollPositions.current[index] || 0;
          const nextIndex = (currentIndex + 1) % category.data.length;
          const productWidth = 200;
          const offset =
            nextIndex * productWidth - (screenWidth - productWidth) / 2;
          ref.scrollTo({ x: offset, animated: true });
          scrollPositions.current[index] = nextIndex;
        }
      });
    }, 2000);

    return () => clearInterval(intervalId);
  }, [categories]);

  const handleDetailView = (item) => {
    navigation.navigate("ProductDetails", { item });
  };

  const handleAuctionView = (auction) => {
    navigation.navigate("AuctionDetails", { auction });
  };

  if (loading) {
    return (
      <View style={styles.loaderScreen}>
        <StatusBar barStyle="light-content" backgroundColor="#0F1B4C" />
        <ActivityIndicator size="large" color="#4F6DF5" />
        <Text style={styles.loaderText}>Loading treasures...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F1B4C" />
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Hero Header */}
        <View style={styles.header}>
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Discover</Text>
              <Text style={styles.headerTitle}>Vintage Vault</Text>
            </View>
          </View>
          <Text style={styles.headerSub}>
            Explore rare antiques, art, and collectibles
          </Text>
        </View>

        {/* Discount Categories */}
        {categories.map((category, index) => (
          <View key={category.title} style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <View
                  style={[styles.sectionIcon, { backgroundColor: "#FFF3E0" }]}
                >
                  <Ionicons name="pricetag" size={16} color="#FF6D00" />
                </View>
                <Text style={styles.sectionTitle}>Top Discounts</Text>
              </View>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{category.data.length}</Text>
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
              ref={(ref) => (scrollRefs.current[index] = ref)}
            >
              {category.data.map((item, itemIndex) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => handleDetailView(item)}
                  activeOpacity={0.85}
                >
                  <View
                    style={[
                      styles.productCard,
                      itemIndex ===
                        (scrollPositions.current[index] || 0) &&
                        styles.productCardActive,
                    ]}
                  >
                    {/* Discount Badge */}
                    {item.discount && (
                      <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>
                          {item.discount}% OFF
                        </Text>
                      </View>
                    )}
                    <Image
                      source={{ uri: item.image }}
                      style={styles.productImage}
                    />
                    <View style={styles.productInfo}>
                      <Text style={styles.productName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={styles.productPrice}>
                        ₹{item.price?.toLocaleString() || item.price}
                      </Text>
                      <Text style={styles.productDesc} numberOfLines={1}>
                        {item.about}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ))}

        {/* Upcoming Auctions Section */}
        {auctions.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <View
                  style={[styles.sectionIcon, { backgroundColor: "#FFEBEE" }]}
                >
                  <Ionicons name="hammer" size={16} color="#EF5350" />
                </View>
                <Text style={styles.sectionTitle}>Upcoming Auctions</Text>
              </View>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            </View>

            {auctions.map((auction) => (
              <TouchableOpacity
                key={auction.id}
                onPress={() => handleAuctionView(auction)}
                activeOpacity={0.85}
              >
                <View style={styles.auctionCard}>
                  <Image
                    source={{ uri: auction.image }}
                    style={styles.auctionImage}
                  />
                  <View style={styles.auctionInfo}>
                    <Text style={styles.auctionName} numberOfLines={1}>
                      {auction.name}
                    </Text>
                    <Text style={styles.auctionDesc} numberOfLines={2}>
                      {auction.info}
                    </Text>
                    <View style={styles.auctionMeta}>
                      <View style={styles.metaRow}>
                        <Ionicons
                          name="calendar-outline"
                          size={12}
                          color="#999"
                        />
                        <Text style={styles.metaText}>
                          {auction.date} • {auction.time}
                        </Text>
                      </View>
                      <Text style={styles.auctionPrice}>
                        ₹{auction.price?.toLocaleString() || auction.price}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Empty state if nothing */}
        {categories.length === 0 && auctions.length === 0 && (
          <View style={styles.emptyWrap}>
            <View style={styles.emptyCircle}>
              <Ionicons name="diamond-outline" size={40} color="#C5CAE9" />
            </View>
            <Text style={styles.emptyTitle}>No Items Yet</Text>
            <Text style={styles.emptySub}>
              Check back soon for new arrivals.
            </Text>
          </View>
        )}

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

  // Header
  header: {
    backgroundColor: "#0F1B4C",
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 22,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
  },
  decorCircle1: {
    position: "absolute",
    top: -25,
    right: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(79,109,245,0.12)",
  },
  decorCircle2: {
    position: "absolute",
    bottom: -20,
    left: -25,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(79,109,245,0.08)",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 14,
    fontWeight: "500",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 0.5,
    marginTop: 2,
  },
  searchBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerSub: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 13,
    marginTop: 12,
    fontWeight: "500",
  },

  // Section
  section: {
    marginTop: 24,
    paddingHorizontal: 18,
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
  countBadge: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  countText: {
    color: "#4F6DF5",
    fontSize: 12,
    fontWeight: "700",
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#EF5350",
  },
  liveText: {
    color: "#EF5350",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  // Horizontal Products
  horizontalScroll: {
    paddingLeft: 0,
    paddingRight: 10,
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    width: 175,
    marginRight: 14,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#0F1B4C",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  productCardActive: {
    borderWidth: 2,
    borderColor: "#4F6DF5",
    transform: [{ scale: 1.03 }],
  },
  productImage: {
    width: "100%",
    height: 140,
    backgroundColor: "#EEF2FF",
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a1a2e",
  },
  productPrice: {
    fontSize: 15,
    fontWeight: "800",
    color: "#4F6DF5",
    marginTop: 4,
  },
  productDesc: {
    fontSize: 11,
    color: "#999",
    marginTop: 3,
  },
  discountBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#EF5350",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 1,
  },
  discountText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
  },

  // Auction Cards
  auctionCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    flexDirection: "row",
    padding: 14,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#0F1B4C",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  auctionImage: {
    width: 90,
    height: 90,
    borderRadius: 14,
    backgroundColor: "#EEF2FF",
    marginRight: 14,
  },
  auctionInfo: {
    flex: 1,
    justifyContent: "center",
  },
  auctionName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1a1a2e",
  },
  auctionDesc: {
    fontSize: 12,
    color: "#999",
    marginTop: 3,
    lineHeight: 16,
  },
  auctionMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: "#999",
    fontWeight: "500",
  },
  auctionPrice: {
    fontSize: 14,
    fontWeight: "800",
    color: "#4F6DF5",
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

export default HomeScreen;
