import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from "react-native";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const AdminPage = ({ navigation }) => {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(""); // New field for image URL
  const [details, setDetails] = useState(""); // New field for additional product details

  // Handle form submission
  const handleAddProduct = async () => {
    if (!productName || !description || !price || !image) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    try {
      const newProduct = {
        name: productName,
        about: description,
        price: parseFloat(price), // Convert price to a number
        image: image,
        detail: details,
        createdAt: new Date(), // Timestamp for when the product is added
      };

      await addDoc(collection(db, "products"), newProduct); // Add new product to Firestore
      Alert.alert("Success", "Product added successfully!");
      
      // Reset fields after adding
      setProductName("");
      setDescription("");
      setPrice("");
      setImage("");
      setDetails("");
    } catch (error) {
      Alert.alert("Error", "Failed to add the product. Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Admin Panel</Text>
      <Text style={styles.subtitle}>Add New Product</Text>

      <View style={styles.form}>
        {/* Product Name */}
        <Text style={styles.label}>Product Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter product name"
          placeholderTextColor="#888" // Light gray placeholder text
          value={productName}
          onChangeText={setProductName}
        />

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter description"
          placeholderTextColor="#888" // Light gray placeholder text
          value={description}
          onChangeText={setDescription}
          multiline
        />

        {/* Price */}
        <Text style={styles.label}>Price (in ₹)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter price"
          placeholderTextColor="#888" // Light gray placeholder text
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />

        {/* Image URL */}
        <Text style={styles.label}>Image URL</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter image URL"
          placeholderTextColor="#888" // Light gray placeholder text
          value={image}
          onChangeText={setImage}
        />

        {/* Product Details */}
        <Text style={styles.label}>Additional Product Details</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter additional details"
          placeholderTextColor="#888" // Light gray placeholder text
          value={details}
          onChangeText={setDetails}
          multiline
        />

        {/* Submit Button */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
          <Text style={styles.addButtonText}>Add Product</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#A9D8FF", // Light blue background
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000", // Black text for title
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000", // Black text for subtitle
    marginBottom: 20,
    textAlign: "center",
  },
  form: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000", // Black text for labels
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#A0C4FF", // Light blue border for inputs
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#000", // Black text for input fields
    marginBottom: 16,
    backgroundColor: "#F0F8FF", // Light blue background for inputs
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  addButton: {
    backgroundColor: "#007BFF", // Darker blue for button
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "#fff", // White text for button
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AdminPage;
