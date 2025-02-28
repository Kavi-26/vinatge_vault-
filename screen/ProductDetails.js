import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';

const ProductDetails = ({ route, navigation }) => {
    const { item } = route.params;
    const [showQRCode, setShowQRCode] = useState(false);

    const handlePayment = () => {
        console.log('Proceeding to payment for', item.name);
        setShowQRCode(true); // Show QR code modal
    };

    // Calculate the discounted price
    const discountedPrice = item.discount
        ? item.price - (item.price * item.discount) / 100
        : item.price;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <Image source={{ uri: item.image }} style={styles.productImage} />
                <View style={styles.textContainer}>
                    <Text style={styles.productName}>{item.name}</Text>

                    {/* Price Section */}
                    <View style={styles.priceContainer}>
                        <Text style={styles.productPrice}>Rs. {discountedPrice.toFixed(2)}</Text>
                        {item.discount && (
                            <>
                                <Text style={styles.originalPrice}>Rs. {item.price.toFixed(2)}</Text>
                                <Text style={styles.productDiscount}>You Save: {item.discount}%</Text>
                            </>
                        )}
                    </View>

                    <Text style={styles.productAbout}>{item.about}</Text>
                    <Text style={styles.productDetail}>{item.detail}</Text>
                </View>

                <TouchableOpacity style={styles.buyButton} onPress={handlePayment}>
                    <Text style={styles.buyButtonText}>Buy Now</Text>
                </TouchableOpacity>
            </View>

            {/* QR Code Modal */}
            <Modal visible={showQRCode} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.gpayCard}>
                        <View style={styles.header}>
                            {/* Placeholder for app or brand logo */}
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>P</Text>
                            </View>
                            <Text style={styles.gpayText}>Pay with GPay</Text>
                        </View>

                        {/* Amount Display */}
                        <Text style={styles.amountDisplay}>Rs. {discountedPrice.toFixed(2)}</Text>

                        {/* QR Code Image Display */}
                        <Image
                            source={require('../assets/gpay1.jpg')} // Replace with your QR image path
                            style={styles.qrCodeImage}
                        />

                        {/* Instruction Text */}
                        <Text style={styles.instructionText}>
                            Scan the QR code to complete your payment
                        </Text>

                        {/* Close Button */}
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => {
                                setShowQRCode(false);
                                navigation.navigate('OrderPlaced'); // Navigate to OrderPlaced screen
                            }}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#a9d0f5',
        padding: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        width: '100%',
        padding: 20,
        alignItems: 'center',
    },
    productImage: {
        width: '100%',
        height: undefined,
        aspectRatio: 1,
        borderRadius: 12,
        marginBottom: 20,
        resizeMode: 'cover',
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    productName: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    priceContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    productPrice: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007BFF',
        marginBottom: 5,
    },
    originalPrice: {
        fontSize: 18,
        color: '#666',
        textDecorationLine: 'line-through',
        marginBottom: 5,
    },
    productDiscount: {
        fontSize: 18,
        color: '#FF5733',
    },
    productAbout: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
        textAlign: 'center',
    },
    productDetail: {
        fontSize: 14,
        color: '#444',
        marginBottom: 20,
        textAlign: 'center',
        lineHeight: 22,
    },
    buyButton: {
        backgroundColor: '#FF5733',
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
    buyButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    gpayCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        width: '80%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#007BFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    avatarText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    gpayText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    amountDisplay: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    qrCodeImage: {
        width: 200,
        height: 200,
        marginBottom: 20,
        resizeMode: 'contain',
    },
    instructionText: {
        fontSize: 14,
        color: '#666',
        marginTop: 20,
        textAlign: 'center',
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#FF5733',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default ProductDetails;
