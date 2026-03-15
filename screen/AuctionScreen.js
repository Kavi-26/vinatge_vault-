import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Modal,
  StatusBar,
  Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");

const AuctionScreen = ({ navigation }) => {
  const [auctionItems, setAuctionItems] = useState([
    {
      id: "1",
      name: "Van Gogh's 'The Starry Night'",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSY9cHgsMHfKoLe6ODQQvFJ39UMFMtNnf6i2Q&s",
      highestBid: 150000,
      timeRemaining: 30,
    },
    {
      id: "2",
      name: "Aztec Sun Stone",
      image: "https://assets.alot.com/assets/common/entertainment/u12806_slide_11131.jpg",
      highestBid: 180000,
      timeRemaining: 210,
    },
    {
      id: "3",
      name: "Coins of Raja Raja Chola",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjY1pC1fHccH35NOz6qQurVyT7o5OafLKUjg&s",
      highestBid: 50000,
      timeRemaining: 310,
    },
  ]);

  const [bidValue, setBidValue] = useState("");
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [itemToPay, setItemToPay] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setAuctionItems((prevItems) =>
        prevItems.map((item) => {
          if (item.timeRemaining === 1 && item.highestBidEntered) {
            handlePayment(item);
          }
          return {
            ...item,
            timeRemaining: Math.max(item.timeRemaining - 1, 0),
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleBid = (id) => {
    const item = auctionItems.find((item) => item.id === id);
    if (!bidValue || isNaN(bidValue)) {
      Alert.alert("Invalid Bid", "Please enter a valid bid amount.");
      return;
    }

    if (parseInt(bidValue) <= item.highestBid) {
      Alert.alert(
        "Low Bid",
        `Your bid must be higher than the current highest bid of ₹${item.highestBid.toLocaleString()}.`
      );
      return;
    }

    setAuctionItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, highestBid: parseInt(bidValue), highestBidEntered: true }
          : item
      )
    );

    Alert.alert("Bid Placed", "Your bid has been successfully placed!");
    setBidValue("");
  };

  const handlePayment = (item) => {
    setItemToPay(item);
    setPaymentModalVisible(true);
  };

  const renderCountdown = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const getTimerColor = (time) => {
    if (time === 0) return "#999";
    if (time < 60) return "#EF5350";
    return "#4F6DF5";
  };

  const renderItem = ({ item }) => {
    const isExpired = item.timeRemaining === 0;

    return (
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <View style={styles.cardBody}>
          {/* Title & Timer Row */}
          <View style={styles.titleRow}>
            <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
            <View style={[styles.timerPill, { backgroundColor: isExpired ? "#F5F5F5" : getTimerColor(item.timeRemaining) + "15" }]}>
              <Ionicons name="time-outline" size={14} color={getTimerColor(item.timeRemaining)} />
              <Text style={[styles.timerText, { color: getTimerColor(item.timeRemaining) }]}>
                {isExpired ? "Ended" : renderCountdown(item.timeRemaining)}
              </Text>
            </View>
          </View>

          {/* Current Bid */}
          <View style={styles.bidRow}>
            <Text style={styles.bidLabel}>Current Bid</Text>
            <Text style={styles.bidAmount}>₹{item.highestBid.toLocaleString()}</Text>
          </View>

          {/* Input & Button */}
          {!isExpired && (
            <View style={styles.actionArea}>
              <View style={styles.inputWrapper}>
                <Text style={styles.rupeePrefix}>₹</Text>
                <TextInput
                  style={styles.bidInput}
                  keyboardType="numeric"
                  value={bidValue}
                  onChangeText={setBidValue}
                />
              </View>
              <TouchableOpacity
                style={styles.bidBtn}
                onPress={() => handleBid(item.id)}
                activeOpacity={0.85}
              >
                <Ionicons name="hammer" size={16} color="#fff" />
                <Text style={styles.bidBtnText}>Bid</Text>
              </TouchableOpacity>
            </View>
          )}

          {isExpired && (
            <View style={styles.expiredBanner}>
              <Ionicons name="checkmark-circle" size={16} color="#999" />
              <Text style={styles.expiredText}>Auction has ended</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F4FF" />
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Live Auctions</Text>
          <Text style={styles.headerSub}>{auctionItems.length} active item{auctionItems.length !== 1 ? "s" : ""}</Text>
        </View>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      <FlatList
        data={auctionItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <View style={styles.emptyCircle}>
              <Ionicons name="hammer-outline" size={40} color="#C5CAE9" />
            </View>
            <Text style={styles.emptyTitle}>No Auctions</Text>
            <Text style={styles.emptySub}>Check back later for live auctions.</Text>
          </View>
        }
      />

      {/* Payment Modal */}
      <Modal
        visible={paymentModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPaymentModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {itemToPay && (
              <>
                <View style={styles.modalIconWrap}>
                  <Ionicons name="trophy" size={32} color="#4F6DF5" />
                </View>
                <Text style={styles.modalTitle}>You Won!</Text>
                <Text style={styles.modalItemName}>{itemToPay.name}</Text>
                <View style={styles.modalAmountBox}>
                  <Text style={styles.modalAmountLabel}>Winning Bid</Text>
                  <Text style={styles.modalAmount}>₹{itemToPay.highestBid.toLocaleString()}</Text>
                </View>

                <Image
                  source={require("../assets/gpay1.jpg")}
                  style={styles.qrImage}
                />

                <TouchableOpacity
                  style={styles.modalBtn}
                  onPress={() => {
                    setPaymentModalVisible(false);
                    navigation.navigate("OrderPlaced");
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={styles.modalBtnText}>Done</Text>
                  <Ionicons name="checkmark" size={18} color="#fff" />
                </TouchableOpacity>
              </>
            )}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 22,
    paddingTop: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E8ECF4",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0F1B4C",
  },
  headerSub: {
    fontSize: 13,
    color: "#999",
    marginTop: 2,
    fontWeight: "500",
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF5350",
  },
  liveText: {
    color: "#EF5350",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  listContent: {
    padding: 18,
    paddingBottom: 40,
  },

  // Card
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#0F1B4C",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardImage: {
    width: "100%",
    height: 180,
    backgroundColor: "#EEF2FF",
  },
  cardBody: {
    padding: 18,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  itemName: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1a1a2e",
    flex: 1,
    marginRight: 10,
  },
  timerPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  timerText: {
    fontSize: 13,
    fontWeight: "700",
  },
  bidRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F4FF",
  },
  bidLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  bidAmount: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0F1B4C",
  },
  actionArea: {
    flexDirection: "row",
    gap: 10,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F7FB",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E8ECF4",
    paddingHorizontal: 14,
  },
  rupeePrefix: {
    fontSize: 16,
    fontWeight: "700",
    color: "#999",
    marginRight: 6,
  },
  bidInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: "#1a1a2e",
    fontWeight: "600",
  },
  bidBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0F1B4C",
    paddingHorizontal: 20,
    borderRadius: 14,
    gap: 6,
    elevation: 4,
    shadowColor: "#0F1B4C",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  bidBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
  },
  expiredBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  expiredText: {
    color: "#999",
    fontSize: 13,
    fontWeight: "600",
  },

  // Empty
  emptyWrap: {
    alignItems: "center",
    marginTop: 80,
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

  // Modal
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
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#0F1B4C",
    marginBottom: 4,
  },
  modalItemName: {
    fontSize: 14,
    color: "#999",
    fontWeight: "500",
    marginBottom: 18,
    textAlign: "center",
  },
  modalAmountBox: {
    backgroundColor: "#F5F7FB",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
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
    fontSize: 26,
    fontWeight: "900",
    color: "#0F1B4C",
    marginTop: 4,
  },
  qrImage: {
    width: 180,
    height: 180,
    borderRadius: 16,
    marginBottom: 20,
  },
  modalBtn: {
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
  modalBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
});

export default AuctionScreen;
