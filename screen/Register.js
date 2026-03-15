import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    ActivityIndicator,
    StatusBar,
    Dimensions,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");

const Register = ({ navigation }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [secureText, setSecureText] = useState(true);

    const validateInput = () => {
        if (username.trim() === "") {
            Alert.alert("Error", "Please enter a valid username.");
            return false;
        }
        if (!email.includes("@")) {
            Alert.alert("Error", "Please enter a valid email.");
            return false;
        }
        if (password.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters.");
            return false;
        }
        return true;
    };

    const RegisterHandler = async () => {
        if (!validateInput()) return;
        setIsLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                username: username,
                email: email,
                createdAt: new Date().toISOString()
            });

            Alert.alert("Success", "Registration successful!");
            // Navigation is handled automatically by onAuthStateChanged in App.js
        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0F1B4C" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContent} 
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                >
                    {/* Top decorative section */}
                    <View style={styles.topSection}>
                        <View style={styles.decorCircle1} />
                        <View style={styles.decorCircle2} />
                        <View style={styles.brandArea}>
                            <View style={styles.logoBox}>
                                <Ionicons name="person-add" size={30} color="#fff" />
                            </View>
                            <Text style={styles.appName}>Join Vintage Vault</Text>
                            <Text style={styles.tagline}>Start Your Collection Today</Text>
                        </View>
                    </View>

                    {/* Form Card */}
                    <View style={styles.formCard}>
                        <Text style={styles.formTitle}>Create Account</Text>
                        <Text style={styles.formSubtitle}>Fill in the details below to register.</Text>

                        {/* Full Name */}
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Full Name</Text>
                            <View style={styles.inputRow}>
                                <Ionicons name="person-outline" size={18} color="#9DA5B4" style={styles.inputIcon} />
                                <TextInput
                                    value={username}
                                    onChangeText={setUsername}
                                    style={styles.input}
                                />
                            </View>
                        </View>

                        {/* Email */}
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Email Address</Text>
                            <View style={styles.inputRow}>
                                <Ionicons name="mail-outline" size={18} color="#9DA5B4" style={styles.inputIcon} />
                                <TextInput
                                    keyboardType="email-address"
                                    value={email}
                                    onChangeText={setEmail}
                                    style={styles.input}
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        {/* Password */}
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputRow}>
                                <Ionicons name="lock-closed-outline" size={18} color="#9DA5B4" style={styles.inputIcon} />
                                <TextInput
                                    secureTextEntry={secureText}
                                    value={password}
                                    onChangeText={setPassword}
                                    style={styles.input}
                                />
                                <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.eyeBtn}>
                                    <Ionicons 
                                        name={secureText ? "eye-off-outline" : "eye-outline"} 
                                        size={18} 
                                        color="#9DA5B4" 
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Info Text */}
                        <View style={styles.infoRow}>
                            <Ionicons name="shield-checkmark-outline" size={14} color="#4F6DF5" />
                            <Text style={styles.infoText}>Password must be at least 6 characters</Text>
                        </View>

                        {/* Register Button */}
                        <TouchableOpacity 
                            style={[styles.primaryBtn, isLoading && styles.btnDisabled]} 
                            onPress={RegisterHandler}
                            disabled={isLoading}
                            activeOpacity={0.85}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <View style={styles.btnContent}>
                                    <Text style={styles.primaryBtnText}>Create Account</Text>
                                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                                </View>
                            )}
                        </TouchableOpacity>

                        {/* Divider */}
                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>or</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                                <Text style={styles.footerLink}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F0F4FF",
    },
    scrollContent: {
        flexGrow: 1,
    },

    // Top Section
    topSection: {
        backgroundColor: "#0F1B4C",
        paddingTop: 60,
        paddingBottom: 50,
        alignItems: "center",
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        overflow: "hidden",
    },
    decorCircle1: {
        position: "absolute",
        top: -30,
        left: -40,
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: "rgba(79,109,245,0.12)",
    },
    decorCircle2: {
        position: "absolute",
        bottom: -25,
        right: -35,
        width: 130,
        height: 130,
        borderRadius: 65,
        backgroundColor: "rgba(79,109,245,0.1)",
    },
    brandArea: {
        alignItems: "center",
    },
    logoBox: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: "#4F6DF5",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
        elevation: 8,
        shadowColor: "#4F6DF5",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
    },
    appName: {
        fontSize: 26,
        fontWeight: "900",
        color: "#fff",
        letterSpacing: 0.5,
    },
    tagline: {
        fontSize: 13,
        color: "rgba(255,255,255,0.5)",
        marginTop: 6,
        fontWeight: "500",
    },

    // Form Card
    formCard: {
        backgroundColor: "#fff",
        marginHorizontal: 20,
        marginTop: -25,
        borderRadius: 28,
        padding: 28,
        paddingTop: 32,
        elevation: 12,
        shadowColor: "#0F1B4C",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        marginBottom: 40,
    },
    formTitle: {
        fontSize: 24,
        fontWeight: "900",
        color: "#1a1a2e",
    },
    formSubtitle: {
        fontSize: 13,
        color: "#999",
        marginTop: 4,
        marginBottom: 24,
        fontWeight: "500",
    },

    // Fields
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
    eyeBtn: {
        padding: 4,
    },

    // Info Row
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 22,
        gap: 6,
    },
    infoText: {
        fontSize: 12,
        color: "#888",
        fontWeight: "500",
    },

    // Buttons
    primaryBtn: {
        backgroundColor: "#0F1B4C",
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: "center",
        justifyContent: "center",
        elevation: 6,
        shadowColor: "#0F1B4C",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    btnDisabled: {
        opacity: 0.6,
    },
    btnContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    primaryBtnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "800",
    },

    // Divider
    divider: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 22,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: "#E8ECF4",
    },
    dividerText: {
        color: "#bbb",
        fontSize: 12,
        fontWeight: "600",
        marginHorizontal: 15,
    },

    // Footer
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    footerText: {
        color: "#888",
        fontSize: 14,
    },
    footerLink: {
        color: "#4F6DF5",
        fontSize: 14,
        fontWeight: "800",
    },
});

export default Register;
