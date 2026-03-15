import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import Ionicons from "react-native-vector-icons/Ionicons";

const AddProduct = ({ navigation }) => {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [details, setDetails] = useState("");

  const handleAddProduct = async () => {
    if (!productName || !description || !price || !image) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    try {
      const newProduct = {
        name: productName,
        about: description,
        price: parseFloat(price),
        image: image,
        detail: details,
        createdAt: new Date(),
      };

      await addDoc(collection(db, "products"), newProduct);
      Alert.alert("Success", "Product added successfully!");
      navigation.navigate("Products");
    } catch (error) {
      Alert.alert("Error", "Failed to add the product.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.formCard}>
        <Text style={styles.label}>Product Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter product name"
          value={productName}
          onChangeText={setProductName}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter description"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Text style={styles.label}>Price (₹)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Image URL</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter image URL"
          value={image}
          onChangeText={setImage}
        />

        <Text style={styles.label}>Additional Details</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter additional details"
          value={details}
          onChangeText={setDetails}
          multiline
        />

        <TouchableOpacity style={styles.primaryButton} onPress={handleAddProduct}>
          <Text style={styles.buttonText}>Submit Product</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    backgroundColor: "#F4F7FE",
    flexGrow: 1,
    justifyContent: "center",
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#444",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F8FAFF",
    borderWidth: 1,
    borderColor: "#E0E5F2",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    color: "#333",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  primaryButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AddProduct;
