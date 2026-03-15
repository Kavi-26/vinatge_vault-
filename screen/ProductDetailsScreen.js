import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  StatusBar,
  Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");

const ProductDetailsScreen = ({ route }) => {
  const { item } = route.params;

  const renderCountdown = (time) => {
    if (!time && time !== 0) return "N/A";
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const isExpired = item.timeRemaining === 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F4FF" />
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Image */}
        <Image source={{ uri: item.image }} style={styles.heroImage} />

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.itemName}>{item.name}</Text>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <View style={[styles.statIcon, { backgroundColor: "#EEF2FF" }]}>
                <Ionicons name="trophy" size={18} color="#4F6DF5" />
              </View>
              <View>
                <Text style={styles.statLabel}>Highest Bid</Text>
                <Text style={styles.statValue}>
                  ₹{item.highestBid?.toLocaleString() || "0"}
                </Text>
              </View>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBox}>
              <View
                style={[
                  styles.statIcon,
                  { backgroundColor: isExpired ? "#F5F5F5" : "#FFEBEE" },
                ]}
              >
                <Ionicons
                  name="time"
                  size={18}
                  color={isExpired ? "#999" : "#EF5350"}
                />
              </View>
              <View>
                <Text style={styles.statLabel}>Time Left</Text>
                <Text
                  style={[
                    styles.statValue,
                    { color: isExpired ? "#999" : "#EF5350" },
                  ]}
                >
                  {isExpired ? "Ended" : renderCountdown(item.timeRemaining)}
                </Text>
              </View>
            </View>
          </View>

          {/* Status Banner */}
          <View
            style={[
              styles.statusBanner,
              { backgroundColor: isExpired ? "#F5F5F5" : "#E8F5E9" },
            ]}
          >
            <Ionicons
              name={isExpired ? "close-circle" : "checkmark-circle"}
              size={18}
              color={isExpired ? "#999" : "#4CAF50"}
            />
            <Text
              style={[
                styles.statusText,
                { color: isExpired ? "#999" : "#4CAF50" },
              ]}
            >
              {isExpired ? "This auction has ended" : "Auction is live — place your bids!"}
            </Text>
          </View>

          {/* Info Section */}
          {item.info && (
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <View style={[styles.sectionIconWrap, { backgroundColor: "#FFF3E0" }]}>
                  <Ionicons name="information-circle" size={16} color="#FF6D00" />
                </View>
                <Text style={styles.sectionTitle}>About This Item</Text>
              </View>
              <Text style={styles.sectionBody}>{item.info}</Text>
            </View>
          )}
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
  heroImage: {
    width: "100%",
    height: width * 0.7,
    backgroundColor: "#EEF2FF",
    resizeMode: "cover",
  },
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
  itemName: {
    fontSize: 24,
    fontWeight: "900",
    color: "#0F1B4C",
    marginBottom: 20,
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    backgroundColor: "#F5F7FB",
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    alignItems: "center",
  },
  statBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  statLabel: {
    fontSize: 11,
    color: "#999",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F1B4C",
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: "#E8ECF4",
    marginHorizontal: 12,
  },

  // Status
  statusBanner: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 14,
    gap: 10,
    marginBottom: 20,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
  },

  // Section
  section: {
    marginTop: 4,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  sectionIconWrap: {
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
  sectionBody: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
    paddingLeft: 40,
  },
});

export default ProductDetailsScreen;
