import React, { useState } from "react";
import {View, Text, StyleSheet, TextInput, Button, Alert, KeyboardAvoidingView, ScrollView, Platform,} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore"; // Import Firestore functions


const Register = ({ navigation }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);


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

            // Save the username to Firestore
            await setDoc(doc(db, "users", user.uid), {
                username: username,
                email: email,
                createdAt: new Date().toISOString()
            });


            Alert.alert("Success", "Registration successful!");
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
                        {/* Display App Name */}
                        <Text style={Styles.appName}>Vintage Vault</Text>

                        {/* Username Input */}
                        <TextInput
                            placeholder="Username"
                            value={username}
                            onChangeText={setUsername}
                            style={Styles.input}
                        />

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

                        {/* Register Button */}
                        <Button
                            title={isLoading ? "Loading..." : "Register"}
                            onPress={RegisterHandler}
                        />

                        {/* Link to Login Screen */}
                        <View style={Styles.link}>
                            <Text>Already have an account? </Text>
                            <Button title="Login" onPress={() => navigation.navigate("Login")} />
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
        borderRadius: 10,
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
        color: "#4B0082", // Choose a color that fits your app's theme
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


export default Register;
