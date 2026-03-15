import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import Ionicons from "react-native-vector-icons/Ionicons";

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
        Alert.alert("Permission Denied", "Location permissions are required.");
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
        setLocationAddress(`Lat: ${coords.latitude}, Lon: ${coords.longitude}`);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch location.");
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

  const InputField = ({ label, icon, value, onChangeText, keyboardType, multiline, lines }) => (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, multiline && styles.inputRowMulti]}>
        <Ionicons name={icon} size={18} color="#9DA5B4" style={styles.inputIcon} />
        <TextInput
          style={[styles.input, multiline && styles.inputMulti]}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType || "default"}
          multiline={multiline}
          numberOfLines={lines}
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
        {/* Title Area */}
        <View style={styles.titleArea}>
          <View style={styles.titleIcon}>
            <Ionicons name="bag-check" size={24} color="#4F6DF5" />
          </View>
          <View>
            <Text style={styles.titleText}>Place Your Order</Text>
            <Text style={styles.titleSub}>Fill in your delivery details</Text>
          </View>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          <InputField
            label="Full Name"
            icon="person-outline"
            value={name}
            onChangeText={setName}
          />
          <InputField
            label="Mobile Number"
            icon="call-outline"
            value={mobileNumber}
            onChangeText={setMobileNumber}
            keyboardType="numeric"
          />
          <InputField
            label="Delivery Address"
            icon="location-outline"
            value={address}
            onChangeText={setAddress}
            multiline
            lines={3}
          />

          {/* Location */}
          <View style={styles.locationBox}>
            <View style={styles.locationInfo}>
              <Ionicons name="navigate-outline" size={18} color="#4F6DF5" />
              <Text style={styles.locationText} numberOfLines={2}>
                {loadingLocation
                  ? "Fetching location..."
                  : locationAddress || "Tap to detect your location"}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.locationBtn}
              onPress={getLocation}
              disabled={loadingLocation}
              activeOpacity={0.85}
            >
              {loadingLocation ? (
                <ActivityIndicator size="small" color="#4F6DF5" />
              ) : (
                <Ionicons name="locate" size={18} color="#4F6DF5" />
              )}
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
            activeOpacity={0.85}
          >
            <Text style={styles.submitBtnText}>Place Order</Text>
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

  // Location
  locationBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F7FB",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E8ECF4",
    padding: 14,
    marginBottom: 22,
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 10,
  },
  locationText: {
    fontSize: 13,
    color: "#888",
    fontWeight: "500",
    flex: 1,
  },
  locationBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },

  // Submit
  submitBtn: {
    backgroundColor: "#0F1B4C",
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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

export default OrderPlacedScreen;
