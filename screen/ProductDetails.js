import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Modal, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ProductDetails = ({ route, navigation }) => {
    const { item } = route.params;
    const [showQRCode, setShowQRCode] = useState(false);
    const [showPaymentSelection, setShowPaymentSelection] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState(null);

    const paymentMethods = [
        { id: 'gpay', name: 'Google Pay', icon: 'google', color: '#4285F4', type: 'material' },
        { id: 'paytm', name: 'Paytm', icon: 'wallet-outline', color: '#00BAF2', type: 'ionicon' },
        { id: 'phonepay', name: 'PhonePe', icon: 'send-outline', color: '#6739B7', type: 'ionicon' },
        { id: 'paypal', name: 'PayPal', icon: 'logo-paypal', color: '#003087', type: 'ionicon' },
    ];

    const handlePayment = () => {
        setShowPaymentSelection(true);
    };

    const handleSelectMethod = (method) => {
        setSelectedMethod(method);
        setShowPaymentSelection(false);
        setShowQRCode(true);
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

            {/* Payment Selection Modal */}
            <Modal visible={showPaymentSelection} transparent={true} animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.selectionCard}>
                        <Text style={styles.modalTitle}>Select Payment Method</Text>
                        {paymentMethods.map((method) => (
                            <TouchableOpacity
                                key={method.id}
                                style={styles.paymentOption}
                                onPress={() => handleSelectMethod(method)}
                            >
                                <View style={[styles.iconContainer, { backgroundColor: method.color }]}>
                                    {method.type === 'material' ? (
                                        <MaterialCommunityIcons name={method.icon} size={24} color="#fff" />
                                    ) : (
                                        <Ionicons name={method.icon} size={24} color="#fff" />
                                    )}
                                </View>
                                <Text style={styles.methodName}>{method.name}</Text>
                                <Ionicons name="chevron-forward" size={20} color="#ccc" />
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setShowPaymentSelection(false)}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* QR Code Modal (Updated for dynamic methods) */}
            <Modal visible={showQRCode} transparent={true} animationType="fade">
                <View style={styles.modalContainer}>
                    <View style={styles.gpayCard}>
                        <View style={styles.header}>
                            <View style={[styles.avatar, { backgroundColor: selectedMethod?.color || '#007BFF' }]}>
                                {selectedMethod?.id === 'gpay' && <MaterialCommunityIcons name="google" size={24} color="#fff" />}
                                {selectedMethod?.id === 'paytm' && <Ionicons name="wallet-outline" size={24} color="#fff" />}
                                {selectedMethod?.id === 'phonepay' && <Ionicons name="send-outline" size={24} color="#fff" />}
                                {selectedMethod?.id === 'paypal' && <Ionicons name="logo-paypal" size={24} color="#fff" />}
                                {!selectedMethod && <Text style={styles.avatarText}>P</Text>}
                            </View>
                            <Text style={styles.gpayText}>Pay with {selectedMethod?.name || 'Payment'}</Text>
                        </View>

                        {/* Amount Display */}
                        <Text style={styles.amountDisplay}>Rs. {discountedPrice.toFixed(2)}</Text>

                        {/* QR Code Image Display */}
                        <Image
                            source={require('../assets/gpay1.jpg')} // Using the existing QR image as requested (no placeholder)
                            style={styles.qrCodeImage}
                        />

                        {/* Instruction Text */}
                        <Text style={styles.instructionText}>
                            Scan the QR code to complete your payment via {selectedMethod?.name}
                        </Text>

                        {/* Done Button */}
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => {
                                setShowQRCode(false);
                                navigation.navigate('OrderPlaced'); // Navigate to OrderPlaced screen
                            }}
                        >
                            <Text style={styles.closeButtonText}>Done</Text>
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
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    selectionCard: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 25,
        maxHeight: '60%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    iconContainer: {
        width: 45,
        height: 45,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    methodName: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    cancelButton: {
        marginTop: 20,
        paddingVertical: 12,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#FF5733',
        fontSize: 16,
        fontWeight: 'bold',
    },
    gpayCard: {
        backgroundColor: '#fff',
        padding: 25,
        borderRadius: 20,
        alignItems: 'center',
        width: '85%',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#007BFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    gpayText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    amountDisplay: {
        fontSize: 28,
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
        marginTop: 10,
        textAlign: 'center',
        paddingHorizontal: 10,
    },
    closeButton: {
        marginTop: 25,
        backgroundColor: '#FF5733',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 12,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProductDetails;
