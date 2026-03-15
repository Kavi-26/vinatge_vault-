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
} from "react-native";

const AuctionScreen = ({ navigation }) => {
  const [auctionItems, setAuctionItems] = useState([
    {
      id: "1",
      name: "Van Gogh's 'The Starry Night'",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSY9cHgsMHfKoLe6ODQQvFJ39UMFMtNnf6i2Q&s",
      highestBid: 150000,
      timeRemaining: 30, // seconds
    },
    {
      id: "2",
      name: "Aztec Sun Stone",
      image: "https://assets.alot.com/assets/common/entertainment/u12806_slide_11131.jpg",
      highestBid: 180000,
      timeRemaining: 210, // seconds
    },
    {
      id: "3",
      name: "Coins of Raja Raja Chola",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjY1pC1fHccH35NOz6qQurVyT7o5OafLKUjg&s",
      highestBid: 50000,
      timeRemaining: 310, // seconds for testing
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
        `Your bid must be higher than the current highest bid of Rs.${item.highestBid}.`
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

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.bid}>Highest Bid: Rs.{item.highestBid}</Text>
        <Text style={styles.timer}>
          ⏳ {renderCountdown(item.timeRemaining)}
        </Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Enter your bid"
        keyboardType="numeric"
        value={bidValue}
        onChangeText={setBidValue}
      />
      <TouchableOpacity
        style={[styles.button, item.timeRemaining === 0 && styles.buttonDisabled]}
        onPress={() => handleBid(item.id)}
        disabled={item.timeRemaining === 0}
      >
        <Text style={styles.buttonText}>Place Bid</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={auctionItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <Modal
        visible={paymentModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setPaymentModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {itemToPay && (
              <>
                <Text style={styles.modalTitle}>Payment for {itemToPay.name}</Text>
                <Text style={styles.modalText}>Highest Bid: Rs.{itemToPay.highestBid}</Text>

                {/* Replace the QR code with an image */}
                <Image
                  source={require("../assets/gpay1.jpg")} // Use your QR image from assets
                  style={{ width: 200, height: 200, marginBottom: 20 }}
                />

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    setPaymentModalVisible(false);
                    navigation.navigate("OrderPlaced"); // Ensure "OrderPlaced" is registered in the navigator
                  }}
                >
                  <Text style={styles.buttonText}>close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#a9d0f5", // Light blue background
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    marginBottom: 20,
    padding: 20,
    shadowColor: "#1976d2", // Blue shadow
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#bbdefb", // Soft blue border
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#bbdefb", // Soft blue border around the image
  },
  infoContainer: {
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "black", // Dark blue title
  },
  bid: {
    fontSize: 18,
    color: "black", // Medium blue for bid
    marginVertical: 5,
  },
  timer: {
    fontSize: 18,
    color: "black", // Bright blue for timer
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#1e88e5", // Light blue input border
    borderRadius: 12,
    padding: 12,
    fontSize: 18,
    marginBottom: 15,
    backgroundColor: "#f0f7ff", // Very light blue background for input
  },
  button: {
     
     backgroundColor: "#2196f3", // Blue button
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonDisabled: {
    backgroundColor: "#90caf9", // Disabled light blue button
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    width: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#0d47a1", // Dark blue modal title
  },
  modalText: {
    fontSize: 20,
    marginBottom: 30,
    color: "black", // Medium blue modal text
  },
});

export default AuctionScreen;
