import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as Location from "expo-location";

const OrderPlacedScreen = () => {
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState(null);
  const [locationAddress, setLocationAddress] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permissions are required to use this feature.");
      }
    };
    requestPermissions();
  }, []);

  const getLocation = async () => {
    setLoadingLocation(true);
    try {
      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(coords);

      try {
        const [reversedAddress] = await Location.reverseGeocodeAsync({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
        setLocationAddress(
          `${reversedAddress.street || "Unknown Street"}, ${reversedAddress.city || "Unknown City"}, ${
            reversedAddress.region || "Unknown Region"
          }, ${reversedAddress.country || "Unknown Country"}`
        );
      } catch (geoError) {
        console.error("Reverse Geocoding Error:", geoError);
        Alert.alert("Error", "Failed to fetch address. Showing raw coordinates instead.");
        setLocationAddress(`Lat: ${coords.latitude}, Lon: ${coords.longitude}`);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch location. Please try again.");
      console.error("Location Error:", error);
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleSubmit = () => {
    if (!name || !mobileNumber || !address) {
      Alert.alert("Missing Information", "Please fill in all fields.");
      return;
    }
    Alert.alert("Success", "Order Placed Successfully!");
    setName("");
    setMobileNumber("");
    setAddress("");
    setLocation(null);
    setLocationAddress("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Place Your Order</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter your mobile number"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
        value={mobileNumber}
        onChangeText={setMobileNumber}
      />

      <TextInput
        style={[styles.input, styles.addressInput]}
        placeholder="Enter your address"
        placeholderTextColor="#aaa"
        value={address}
        onChangeText={setAddress}
        multiline
        numberOfLines={4}
      />

      <Text style={styles.locationText}>
        {loadingLocation
          ? "Fetching location..."
          : locationAddress || "Press 'Get Location' to fetch your current location."}
      </Text>

      <TouchableOpacity style={styles.button} onPress={getLocation}>
        <Text style={styles.buttonText}>Get Location</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addressInput: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButton: {
    backgroundColor: "#2196F3",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  locationText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
});

export default OrderPlacedScreen;
