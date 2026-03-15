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
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");

const Login = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [secureText, setSecureText] = useState(true);

    const onChangeScreenHandler = () => {
        navigation.navigate("Register"); 
    };

    const validateInput = () => {
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

    const LoginHandler = async () => {
        if (!validateInput()) return;
        setIsLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userDoc = await getDoc(doc(db, "users", user.uid));
            
            if (userDoc.exists()) {
                const userData = userDoc.data();
                if (userData.admin === true) {
                    Alert.alert("Success", "Admin login successful!");
                    navigation.replace("AdminTabs");
                } else {
                    Alert.alert("Success", "Login successful!");
                    navigation.replace("Home1");
                }
            } else {
                Alert.alert("Success", "Login successful!");
                navigation.replace("Home1");
            }
           
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
                                <Ionicons name="diamond" size={32} color="#fff" />
                            </View>
                            <Text style={styles.appName}>Vintage Vault</Text>
                            <Text style={styles.tagline}>Discover Timeless Treasures</Text>
                        </View>
                    </View>

                    {/* Form Card */}
                    <View style={styles.formCard}>
                        <Text style={styles.formTitle}>Sign In</Text>
                        <Text style={styles.formSubtitle}>Welcome back! Enter your credentials.</Text>

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

                        <TouchableOpacity style={styles.forgotBtn}>
                            <Text style={styles.forgotText}>Forgot Password?</Text>
                        </TouchableOpacity>

                        {/* Sign In Button */}
                        <TouchableOpacity 
                            style={[styles.primaryBtn, isLoading && styles.btnDisabled]} 
                            onPress={LoginHandler}
                            disabled={isLoading}
                            activeOpacity={0.85}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <View style={styles.btnContent}>
                                    <Text style={styles.primaryBtnText}>Sign In</Text>
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
                            <Text style={styles.footerText}>New to Vintage Vault? </Text>
                            <TouchableOpacity onPress={onChangeScreenHandler}>
                                <Text style={styles.footerLink}>Create Account</Text>
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
        paddingTop: 70,
        paddingBottom: 50,
        alignItems: "center",
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        overflow: "hidden",
    },
    decorCircle1: {
        position: "absolute",
        top: -30,
        right: -40,
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: "rgba(79,109,245,0.15)",
    },
    decorCircle2: {
        position: "absolute",
        bottom: -20,
        left: -30,
        width: 120,
        height: 120,
        borderRadius: 60,
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
        fontSize: 28,
        fontWeight: "900",
        color: "#fff",
        letterSpacing: 1,
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
        marginBottom: 28,
        fontWeight: "500",
    },

    // Fields
    fieldGroup: {
        marginBottom: 20,
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

    forgotBtn: {
        alignSelf: "flex-end",
        marginBottom: 24,
    },
    forgotText: {
        color: "#4F6DF5",
        fontSize: 13,
        fontWeight: "700",
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
        marginVertical: 24,
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

export default Login;
