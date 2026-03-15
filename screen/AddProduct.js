import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { db } from "../firebaseConfig";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import Ionicons from "react-native-vector-icons/Ionicons";

const AddProduct = ({ navigation, route }) => {
  const [existingProduct, setExistingProduct] = useState(null);
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [details, setDetails] = useState("");

  // Sync form state with route params whenever this tab gains focus
  useFocusEffect(
    useCallback(() => {
      const product = route.params?.product || null;
      setExistingProduct(product);
      if (product) {
        setProductName(product.name || "");
        setDescription(product.about || "");
        setPrice(product.price?.toString() || "");
        setImage(product.image || "");
        setDetails(product.detail || "");
      } else {
        setProductName("");
        setDescription("");
        setPrice("");
        setImage("");
        setDetails("");
      }
    }, [route.params?.product])
  );

  const handleAddProduct = async () => {
    if (!productName || !description || !price || !image) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    try {
      const productData = {
        name: productName,
        about: description,
        price: parseFloat(price),
        image: image,
        detail: details,
        updatedAt: new Date(),
      };

      if (existingProduct) {
        await updateDoc(doc(db, "products", existingProduct.id), productData);
        Alert.alert("Success", "Product updated successfully!");
      } else {
        productData.createdAt = new Date();
        await addDoc(collection(db, "products"), productData);
        Alert.alert("Success", "Product added successfully!");
      }

      // Clear params so the form resets next time
      navigation.setParams({ product: undefined });
      navigation.goBack();
    } catch (error) {
      console.error("Error saving product:", error);
      Alert.alert("Error", `Failed to ${existingProduct ? "update" : "add"} the product.`);
    }
  };

  const InputField = ({ label, icon, value, onChangeText, multiline, keyboardType, lines }) => (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, multiline && styles.inputRowMulti]}>
        <Ionicons name={icon} size={18} color="#9DA5B4" style={styles.inputIcon} />
        <TextInput
          style={[styles.input, multiline && styles.inputMulti]}
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
          numberOfLines={lines}
          keyboardType={keyboardType || "default"}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F4FF" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={styles.titleArea}>
          <View style={styles.titleIcon}>
            <Ionicons
              name={existingProduct ? "create" : "add-circle"}
              size={24}
              color="#4F6DF5"
            />
          </View>
          <View>
            <Text style={styles.titleText}>
              {existingProduct ? "Edit Product" : "New Product"}
            </Text>
            <Text style={styles.titleSub}>
              {existingProduct ? "Update the details below" : "Fill in the details to add"}
            </Text>
          </View>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          <InputField
            label="Product Name"
            icon="pricetag-outline"
            value={productName}
            onChangeText={setProductName}
          />
          <InputField
            label="Description"
            icon="document-text-outline"
            value={description}
            onChangeText={setDescription}
            multiline
            lines={3}
          />
          <InputField
            label="Price (₹)"
            icon="cash-outline"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
          <InputField
            label="Image URL"
            icon="image-outline"
            value={image}
            onChangeText={setImage}
          />
          <InputField
            label="Additional Details"
            icon="information-circle-outline"
            value={details}
            onChangeText={setDetails}
            multiline
            lines={3}
          />

          <TouchableOpacity style={styles.submitBtn} onPress={handleAddProduct} activeOpacity={0.85}>
            <Text style={styles.submitBtnText}>
              {existingProduct ? "Update Product" : "Add Product"}
            </Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4FF",
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 40,
  },

  // Title
  titleArea: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 14,
    paddingHorizontal: 4,
  },
  titleIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0F1B4C",
  },
  titleSub: {
    fontSize: 13,
    color: "#999",
    marginTop: 2,
    fontWeight: "500",
  },

  // Form
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 22,
    elevation: 4,
    shadowColor: "#0F1B4C",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#555",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F7FB",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E8ECF4",
    paddingHorizontal: 14,
  },
  inputRowMulti: {
    alignItems: "flex-start",
    paddingTop: 14,
  },
  inputIcon: {
    marginRight: 10,
    marginTop: 0,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: "#1a1a2e",
    fontWeight: "500",
  },
  inputMulti: {
    height: 80,
    textAlignVertical: "top",
  },
  submitBtn: {
    backgroundColor: "#0F1B4C",
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
    elevation: 6,
    shadowColor: "#0F1B4C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
});

export default AddProduct;
