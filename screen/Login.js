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
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import Ionicons from "react-native-vector-icons/Ionicons";

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
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={Styles.mainContainer}
        >
            <ScrollView contentContainerStyle={Styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={Styles.headerContainer}>
                    <View style={Styles.logoCircle}>
                        <Ionicons name="lock-closed" size={40} color="#fff" />
                    </View>
                    <Text style={Styles.appName}>Vintage Vault</Text>
                    <Text style={Styles.welcomeText}>Welcome back, please sign in</Text>
                </View>

                <View style={Styles.formContainer}>
                    {/* Email Input */}
                    <View style={Styles.inputGroup}>
                        <Text style={Styles.label}>Email Address</Text>
                        <View style={Styles.inputWrapper}>
                            <Ionicons name="mail-outline" size={20} color="#666" style={Styles.inputIcon} />
                            <TextInput
                                keyboardType="email-address"
                                value={email}
                                onChangeText={setEmail}
                                style={Styles.input}
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    {/* Password Input */}
                    <View style={Styles.inputGroup}>
                        <Text style={Styles.label}>Password</Text>
                        <View style={Styles.inputWrapper}>
                            <Ionicons name="key-outline" size={20} color="#666" style={Styles.inputIcon} />
                            <TextInput
                                secureTextEntry={secureText}
                                value={password}
                                onChangeText={setPassword}
                                style={Styles.input}
                            />
                            <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                                <Ionicons 
                                    name={secureText ? "eye-off-outline" : "eye-outline"} 
                                    size={20} 
                                    color="#666" 
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity style={Styles.forgotPassword}>
                        <Text style={Styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    {/* Login Button */}
                    <TouchableOpacity 
                        style={[Styles.loginBtn, isLoading && Styles.disabledBtn]} 
                        onPress={LoginHandler}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={Styles.loginBtnText}>Sign In</Text>
                        )}
                    </TouchableOpacity>

                    {/* Link to Register Screen */}
                    <View style={Styles.footer}>
                        <Text style={Styles.footerText}>New to Vintage Vault? </Text>
                        <TouchableOpacity onPress={onChangeScreenHandler}>
                            <Text style={Styles.registerLink}>Create Account</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const Styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#F4F7FE",
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 25,
    },
    headerContainer: {
        alignItems: "center",
        marginBottom: 40,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#1B3BBB",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
        elevation: 10,
        shadowColor: "#1B3BBB",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    appName: {
        fontSize: 32,
        fontWeight: "900",
        color: "#1B3BBB",
        letterSpacing: 1,
    },
    welcomeText: {
        fontSize: 16,
        color: "#777",
        marginTop: 5,
        fontWeight: "500",
    },
    formContainer: {
        backgroundColor: "#fff",
        borderRadius: 30,
        padding: 30,
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: "700",
        color: "#444",
        marginBottom: 10,
        marginLeft: 5,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F8FAFF",
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "#E0E5F2",
        paddingHorizontal: 15,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        paddingVertical: 15,
        fontSize: 16,
        color: "#333",
        fontWeight: "500",
    },
    forgotPassword: {
        alignSelf: "flex-end",
        marginBottom: 30,
    },
    forgotPasswordText: {
        color: "#1B3BBB",
        fontSize: 14,
        fontWeight: "600",
    },
    loginBtn: {
        backgroundColor: "#1B3BBB",
        borderRadius: 18,
        paddingVertical: 18,
        alignItems: "center",
        justifyContent: "center",
        elevation: 5,
        shadowColor: "#1B3BBB",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
    },
    disabledBtn: {
        opacity: 0.7,
    },
    loginBtnText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "800",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 30,
    },
    footerText: {
        color: "#777",
        fontSize: 15,
    },
    registerLink: {
        color: "#1B3BBB",
        fontSize: 15,
        fontWeight: "800",
    },
});

export default Login;
