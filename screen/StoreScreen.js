import React, { useState, useEffect } from 'react';
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
    navigation.navigate("ProductDetails", { item });
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity onPress={() => handleDetailView(item)} style={styles.productTouchable}>
      <View style={styles.productContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>Rs.{item.price}</Text>
        <Text style={styles.productAbout}>{item.about}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <ScrollView>
          <View style={styles.categoriesHeader}>
            {categories.map(category => (
              <Text key={category.title} style={styles.categoryTitle}>Product</Text>
            ))}
          </View>
        </ScrollView>
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#a9d0f5', // Light Blue background
    paddingHorizontal: 15,
    paddingTop: 30,
    paddingBottom: 20,
  },
  searchBar: {
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#dcdde1',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 5,
  },
  categoriesHeader: {
    marginBottom: 15,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#34495e',
    marginBottom: 10,
  },
  productTouchable: {
    marginBottom: 15,
  },
  productContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  productImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    backgroundColor: '#f5f5f5',
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    margin: 10,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#27ae60',
    marginHorizontal: 10,
  },
  productAbout: {
    fontSize: 14,
    color: '#7f8c8d',
    marginHorizontal: 10,
    marginBottom: 10,
  },
});


export default StoreScreen;







