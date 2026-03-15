import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Button,
    Alert,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

const Login = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

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

            // Fetch user role from Firestore
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
                // If user doc doesn't exist, assume regular user or handle error
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
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={Styles.container}>
                    <View style={Styles.formContainer}>
                        <Text style={Styles.appName}>Vintage Vault</Text>

                        {/* Email Input */}
                        <TextInput
                            placeholder="Email"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                            style={Styles.input}
                        />

                        {/* Password Input */}
                        <TextInput
                            placeholder="Password"
                            secureTextEntry={true}
                            value={password}
                            onChangeText={setPassword}
                            style={Styles.input}
                        />

                        {/* Login Button */}
                        <Button
                            title={isLoading ? "Loading..." : "Login"}
                            onPress={LoginHandler}
                        />

                        {/* Link to Register Screen */}
                        <View style={Styles.link}>
                            <Text>Don't have an account? </Text>
                            <Button title="Register" onPress={onChangeScreenHandler} />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ADD8E6", 
    },
    formContainer: {
        width: "90%",
        alignItems: "center",
        paddingVertical: 20,
        paddingHorizontal: 10,
        backgroundColor: "#ffffff",
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    appName: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 30,
        color: "#4B0082",
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
        width: "100%",
    },
    link: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
});


export default Login;
