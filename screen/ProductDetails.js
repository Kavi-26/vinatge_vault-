import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  StatusBar,
  Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const { width } = Dimensions.get("window");

const ProductDetails = ({ route, navigation }) => {
  const { item } = route.params;
  const [showQRCode, setShowQRCode] = useState(false);
  const [showPaymentSelection, setShowPaymentSelection] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);

  const paymentMethods = [
    { id: "gpay", name: "Google Pay", icon: "google", color: "#4285F4", type: "material" },
    { id: "paytm", name: "Paytm", icon: "wallet-outline", color: "#00BAF2", type: "ionicon" },
    { id: "phonepay", name: "PhonePe", icon: "send-outline", color: "#6739B7", type: "ionicon" },
    { id: "paypal", name: "PayPal", icon: "logo-paypal", color: "#003087", type: "ionicon" },
  ];

  const handlePayment = () => {
    setShowPaymentSelection(true);
  };

  const handleSelectMethod = (method) => {
    setSelectedMethod(method);
    setShowPaymentSelection(false);
    setShowQRCode(true);
  };

  const discountedPrice = item.discount
    ? item.price - (item.price * item.discount) / 100
    : item.price;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F4FF" />
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Product Image */}
        <View style={styles.imageWrap}>
          <Image source={{ uri: item.image }} style={styles.productImage} />
          {item.discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{item.discount}% OFF</Text>
            </View>
          )}
        </View>

        {/* Product Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.productName}>{item.name}</Text>

          {/* Price Section */}
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.priceLabel}>Price</Text>
              <Text style={styles.priceValue}>
                ₹{discountedPrice?.toFixed(2)}
              </Text>
            </View>
            {item.discount && (
              <View style={styles.savingsBox}>
                <Text style={styles.originalPrice}>
                  ₹{item.price?.toFixed(2)}
                </Text>
                <View style={styles.savingsBadge}>
                  <Ionicons name="trending-down" size={12} color="#4CAF50" />
                  <Text style={styles.savingsText}>Save {item.discount}%</Text>
                </View>
              </View>
            )}
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* About Section */}
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <View style={[styles.sectionIcon, { backgroundColor: "#EEF2FF" }]}>
                <Ionicons name="information-circle" size={16} color="#4F6DF5" />
              </View>
              <Text style={styles.sectionTitle}>About</Text>
            </View>
            <Text style={styles.aboutText}>{item.about}</Text>
          </View>

          {/* Details Section */}
          {item.detail && (
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <View style={[styles.sectionIcon, { backgroundColor: "#FFF3E0" }]}>
                  <Ionicons name="document-text" size={16} color="#FF6D00" />
                </View>
                <Text style={styles.sectionTitle}>Details</Text>
              </View>
              <Text style={styles.detailText}>{item.detail}</Text>
            </View>
          )}

          {/* Buy Button */}
          <TouchableOpacity
            style={styles.buyBtn}
            onPress={handlePayment}
            activeOpacity={0.85}
          >
            <Ionicons name="card-outline" size={20} color="#fff" />
            <Text style={styles.buyBtnText}>Buy Now</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Payment Selection Modal */}
      <Modal visible={showPaymentSelection} transparent={true} animationType="slide">
        <View style={styles.sheetOverlay}>
          <View style={styles.sheetContent}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Payment Method</Text>
            <Text style={styles.sheetSub}>Select how you'd like to pay</Text>

            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={styles.paymentRow}
                onPress={() => handleSelectMethod(method)}
                activeOpacity={0.7}
              >
                <View style={[styles.paymentIcon, { backgroundColor: method.color }]}>
                  {method.type === "material" ? (
                    <MaterialCommunityIcons name={method.icon} size={20} color="#fff" />
                  ) : (
                    <Ionicons name={method.icon} size={20} color="#fff" />
                  )}
                </View>
                <Text style={styles.paymentName}>{method.name}</Text>
                <Ionicons name="chevron-forward" size={18} color="#C5CAE9" />
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setShowPaymentSelection(false)}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* QR Code Modal */}
      <Modal visible={showQRCode} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconWrap}>
              <View style={[styles.paymentIcon, { backgroundColor: selectedMethod?.color || "#4F6DF5" }]}>
                {selectedMethod?.type === "material" ? (
                  <MaterialCommunityIcons name={selectedMethod?.icon} size={22} color="#fff" />
                ) : (
                  <Ionicons name={selectedMethod?.icon || "card"} size={22} color="#fff" />
                )}
              </View>
            </View>
            <Text style={styles.modalTitle}>
              Pay with {selectedMethod?.name || "Payment"}
            </Text>

            <View style={styles.modalAmountBox}>
              <Text style={styles.modalAmountLabel}>Amount</Text>
              <Text style={styles.modalAmount}>₹{discountedPrice?.toFixed(2)}</Text>
            </View>

            <Image
              source={require("../assets/gpay1.jpg")}
              style={styles.qrImage}
            />

            <Text style={styles.modalInstruction}>
              Scan the QR code to complete payment
            </Text>

            <TouchableOpacity
              style={styles.doneBtn}
              onPress={() => {
                setShowQRCode(false);
                navigation.navigate("OrderPlaced");
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.doneBtnText}>Done</Text>
              <Ionicons name="checkmark" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4FF",
  },

  // Image
  imageWrap: {
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: width * 0.85,
    backgroundColor: "#EEF2FF",
    resizeMode: "cover",
  },
  discountBadge: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "#EF5350",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  discountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
  },

  // Info Card
  infoCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -24,
    padding: 24,
    paddingBottom: 40,
    elevation: 8,
    shadowColor: "#0F1B4C",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  productName: {
    fontSize: 24,
    fontWeight: "900",
    color: "#0F1B4C",
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 11,
    color: "#999",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  priceValue: {
    fontSize: 28,
    fontWeight: "900",
    color: "#4F6DF5",
    marginTop: 2,
  },
  savingsBox: {
    alignItems: "flex-end",
  },
  originalPrice: {
    fontSize: 16,
    color: "#C5CAE9",
    textDecorationLine: "line-through",
    fontWeight: "600",
  },
  savingsBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 4,
    gap: 4,
  },
  savingsText: {
    color: "#4CAF50",
    fontSize: 11,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F4FF",
    marginBottom: 20,
  },

  // Sections
  section: {
    marginBottom: 18,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  sectionIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1a1a2e",
  },
  aboutText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
    paddingLeft: 40,
  },
  detailText: {
    fontSize: 13,
    color: "#888",
    lineHeight: 20,
    paddingLeft: 40,
  },

  // Buy Button
  buyBtn: {
    backgroundColor: "#0F1B4C",
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
    elevation: 6,
    shadowColor: "#0F1B4C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  buyBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
  },

  // Payment Bottom Sheet
  sheetOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(15,27,76,0.5)",
  },
  sheetContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 36,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E8ECF4",
    alignSelf: "center",
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0F1B4C",
    marginBottom: 4,
  },
  sheetSub: {
    fontSize: 13,
    color: "#999",
    marginBottom: 20,
    fontWeight: "500",
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F7FB",
  },
  paymentIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  paymentName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a2e",
  },
  cancelBtn: {
    marginTop: 18,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#F5F7FB",
    borderRadius: 14,
  },
  cancelBtnText: {
    color: "#999",
    fontSize: 15,
    fontWeight: "700",
  },

  // QR Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15,27,76,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 28,
    alignItems: "center",
    elevation: 12,
    shadowColor: "#0F1B4C",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  modalIconWrap: {
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0F1B4C",
    marginBottom: 16,
  },
  modalAmountBox: {
    backgroundColor: "#F5F7FB",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 30,
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  modalAmountLabel: {
    fontSize: 11,
    color: "#999",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  modalAmount: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0F1B4C",
    marginTop: 4,
  },
  qrImage: {
    width: 180,
    height: 180,
    borderRadius: 16,
    marginBottom: 16,
    resizeMode: "contain",
  },
  modalInstruction: {
    fontSize: 13,
    color: "#999",
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "500",
  },
  doneBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0F1B4C",
    paddingVertical: 16,
    borderRadius: 16,
    width: "100%",
    gap: 8,
    elevation: 6,
    shadowColor: "#0F1B4C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  doneBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
});

export default ProductDetails;
