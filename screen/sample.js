import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { db } from "../firebaseConfig";
import { getDocs, collection } from 'firebase/firestore';

const StoreScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = await getDocs(collection(db, "products"));
        const productsData = productsCollection.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Group products by category
        const groupedCategories = productsData.reduce((acc, product) => {
          const { category } = product;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(product);
          return acc;
        }, {});

        // Format the grouped data for FlatList
        const formattedCategories = Object.keys(groupedCategories).map(key => ({
          title: key,
          data: groupedCategories[key],
        }));

        setCategories(formattedCategories);
        setFilteredProducts(productsData); // Initial filtered products
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const allProducts = categories.flatMap(category => category.data);
    const filtered = allProducts.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleDetailView = (item) => {
    navigation.navigate("ProductDetail", { item });
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity onPress={() => handleDetailView(item)}>
      <View key={item.id} style={styles.productContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>Rs.{item.price}</Text>
        <Text style={styles.productAbout}>{item.about}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search products..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {categories.map(category => (
              <Text key={category.title} style={styles.categoryTitle}>
                {category.title}
              </Text>
            ))}
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 10,
  },
  searchBar: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  productContainer: {
    backgroundColor: '#fff',
    marginVertical: 10,
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 250,
    borderRadius: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  productPrice: {
    fontSize: 14,
    color: '#888',
    marginVertical: 5,
  },
  productDescription: {
    fontSize: 12,
    color: '#555',
  },
});

export default StoreScreen;
