import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { db } from "../firebaseConfig";
import { getDocs, collection } from 'firebase/firestore';

const { width: screenWidth } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const scrollRefs = useRef([]);
  const scrollPositions = useRef({}); // Keeps track of scroll position for each category

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = await getDocs(collection(db, "dproducts"));
        const productsData = productsCollection.docs.map(doc => ({
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

        const formattedCategories = Object.keys(groupedCategories).map(key => ({
          title: key,
          data: groupedCategories[key],
        }));

        setCategories(formattedCategories);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };

    const fetchAuctions = async () => {
      try {
        const auctionCollection = await getDocs(collection(db, "auction pro"));
        const auctionData = auctionCollection.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAuctions(auctionData);
      } catch (error) {
        console.error("Error fetching auctions: ", error);
      }
    };

    fetchProducts();
    fetchAuctions();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      categories.forEach((category, index) => {
        const ref = scrollRefs.current[index];
        if (ref) {
          const currentIndex = scrollPositions.current[index] || 0;
          const nextIndex = (currentIndex + 1) % category.data.length;

          const productWidth = 200; // Product width including margin
          const offset = nextIndex * productWidth - (screenWidth - productWidth) / 2;

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

  return (
    <ScrollView style={styles.container}>
      {/* Discount Categories */}
      {categories.map((category, index) => (
        <View key={category.title} style={styles.categoryContainer}>
          <Text style={styles.categoryTitle}>Top Discount</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContainer}
            ref={(ref) => (scrollRefs.current[index] = ref)}
          >
            {category.data.map((item, itemIndex) => (
              <TouchableOpacity key={item.id} onPress={() => handleDetailView(item)}>
                <View
                  style={[
                    styles.productContainer,
                    itemIndex === (scrollPositions.current[index] || 0) && styles.centeredProduct,
                  ]}
                >
                  {/* Display Discount Badge */}
                  {item.discount && (
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>{item.discount}% OFF</Text>
                    </View>
                  )}
                  <Image source={{ uri: item.image }} style={styles.productImage} />
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productPrice}>Rs.{item.price}</Text>
                  <Text style={styles.productDescription}>{item.about}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ))}

      {/* Upcoming Auctions Section */}
      <View style={styles.auctionContainer}>
        <Text style={styles.auctionTitle}>Upcoming Auctions</Text>
        {auctions.map((auction) => (
          <TouchableOpacity
            key={auction.id}
            onPress={() => handleAuctionView(auction)}
          >
            <View style={styles.auctionItem}>
              <Image source={{ uri: auction.image }} style={styles.auctionImage} />
              <View style={styles.auctionDetails}>
                <Text style={styles.auctionName}>{auction.name}</Text>
                <Text style={styles.auctionInfo}>{auction.info}</Text>
                <Text style={styles.auctionDate}>
                  Date: {auction.date} | Time: {auction.time}
                </Text>
                <Text style={styles.auctionPrice}>Starting Price: Rs.{auction.price}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#a9d0f5',
    padding: 10,
  },
  categoryContainer: {
    marginVertical: 20,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#444',
    marginBottom: 10,
  },
  horizontalScrollContainer: {
    flexDirection: 'row',
  },
  productContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 10,
    width: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  centeredProduct: {
    transform: [{ scale: 1.1 }], // Scale the centered product for emphasis
    borderColor: '#FFD700',
    borderWidth: 2,
  },
  productImage: {
    width: '100%',
    height: 140,
    borderRadius: 8,
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 14,
    color: '#4CAF50',
    textAlign: 'center',
  },
  productDescription: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#FF6347',
    padding: 5,
    borderRadius: 5,
    zIndex: 1, // Ensure it sits on top of other content
  },
  discountText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  auctionContainer: {
    marginTop: 20,
  },
  auctionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  auctionItem: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  auctionImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  auctionDetails: {
    flex: 1,
  },
  auctionName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  auctionInfo: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  auctionDate: {
    fontSize: 12,
    color: '#999',
  },
  auctionPrice: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
});

export default HomeScreen;
