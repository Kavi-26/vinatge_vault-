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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import Ionicons from "react-native-vector-icons/Ionicons";

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
            navigation.replace("Login");
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
                        <Ionicons name="person-add" size={40} color="#fff" />
                    </View>
                    <Text style={Styles.appName}>Vintage Vault</Text>
                    <Text style={Styles.welcomeText}>Create your account to get started</Text>
                </View>

                <View style={Styles.formContainer}>
                    {/* Username Input */}
                    <View style={Styles.inputGroup}>
                        <Text style={Styles.label}>Full Name</Text>
                        <View style={Styles.inputWrapper}>
                            <Ionicons name="person-outline" size={20} color="#666" style={Styles.inputIcon} />
                            <TextInput
                                value={username}
                                onChangeText={setUsername}
                                style={Styles.input}
                            />
                        </View>
                    </View>

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

                    {/* Register Button */}
                    <TouchableOpacity 
                        style={[Styles.registerBtn, isLoading && Styles.disabledBtn]} 
                        onPress={RegisterHandler}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={Styles.registerBtnText}>Create Account</Text>
                        )}
                    </TouchableOpacity>

                    {/* Link to Login Screen */}
                    <View style={Styles.footer}>
                        <Text style={Styles.footerText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                            <Text style={Styles.loginLink}>Sign In</Text>
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
        marginBottom: 30,
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
        textAlign: "center",
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
    registerBtn: {
        backgroundColor: "#1B3BBB",
        borderRadius: 18,
        paddingVertical: 18,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        elevation: 5,
        shadowColor: "#1B3BBB",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
    },
    disabledBtn: {
        opacity: 0.7,
    },
    registerBtnText: {
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
    loginLink: {
        color: "#1B3BBB",
        fontSize: 15,
        fontWeight: "800",
    },
});

export default Register;
