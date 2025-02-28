import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const AuctionDetails = ({ route }) => {
  const { auction } = route.params;
  const [auctionDetails, setAuctionDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuctionDetails = async () => {
      try {
        const auctionDoc = await getDoc(doc(db, "auction pro", auction.id));
        if (auctionDoc.exists()) {
          setAuctionDetails({ id: auctionDoc.id, ...auctionDoc.data() });
        } else {
          console.error("No such auction document found in Firestore!");
        }
      } catch (error) {
        console.error("Error fetching auction details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctionDetails();
  }, [auction.id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading Auction Details...</Text>
      </View>
    );
  }

  if (!auctionDetails) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Auction details not available.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: auctionDetails.image }}
        style={styles.auctionImage}
      />
      <View style={styles.card}>
        <Text style={styles.title}>{auctionDetails.name}</Text>

        <Text style={styles.sectionLabel}>Starting Price</Text>
        <Text style={styles.price}>Rs. {auctionDetails.price}</Text>

        <Text style={styles.sectionLabel}>Auction Info</Text>
        <Text style={styles.info}>{auctionDetails.info}</Text>

        <Text style={styles.sectionLabel}>Details</Text>
        <Text style={styles.details}>{auctionDetails.detail}</Text>

        <View style={styles.row}>
          <View style={styles.dateTimeContainer}>
            <Text style={styles.dateLabel}>Date</Text>
            <Text style={styles.dateValue}>{auctionDetails.date}</Text>
          </View>
          <View style={styles.dateTimeContainer}>
            <Text style={styles.dateLabel}>Time</Text>
            <Text style={styles.dateValue}>{auctionDetails.time}</Text>
          </View>
        </View>

        {/* <Text style={styles.sectionLabel}>Description</Text>
        <Text style={styles.description}>{auctionDetails.description}</Text> */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAEAEA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  auctionImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  card: {
    margin: 20,
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 15,
    marginBottom: 5,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  info: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
    lineHeight: 22,
  },
  details: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
    lineHeight: 22,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
  },
  dateTimeContainer: {
    flex: 1,
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  dateValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 5,
  },
  description: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
  },
});

export default AuctionDetails;
