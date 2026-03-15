import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  Switch,
} from "react-native";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, doc, updateDoc } from "firebase/firestore";
import Ionicons from "react-native-vector-icons/Ionicons";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUsername, setEditUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "users"));
      const querySnapshot = await getDocs(q);
      const userList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
    } catch (error) {
      console.error("Error fetching users:", error);
      Alert.alert("Error", "Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditUsername(user.username || "");
    setIsAdmin(user.admin || false);
    setEditModalVisible(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    try {
      const userRef = doc(db, "users", selectedUser.id);
      await updateDoc(userRef, {
        username: editUsername,
        admin: isAdmin,
      });
      Alert.alert("Success", "User updated successfully!");
      setEditModalVisible(false);
      fetchUsers();
    } catch (error) {
      Alert.alert("Error", "Failed to update user.");
    }
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.cardMain}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={24} color="#1B3BBB" />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.username || "Anonymous"}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
          <View style={[styles.roleBadge, item.admin ? styles.adminBadge : styles.userBadge]}>
            <Text style={[styles.roleText, item.admin ? styles.adminText : styles.userText]}>
              {item.admin ? "Administrator" : "Standard User"}
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={() => openEditModal(item)} style={styles.editBtn}>
        <Ionicons name="settings-outline" size={22} color="#1B3BBB" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <Text style={styles.headerTitle}>User Accounts</Text>
        <Text style={styles.headerSubtitle}>Manage access and profiles</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1B3BBB" style={styles.loader} />
      ) : (
        <>
          <FlatList
            data={users}
            keyExtractor={(item) => item.id}
            renderItem={renderUserItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="people-outline" size={80} color="#ddd" />
                <Text style={styles.emptyText}>No users registered.</Text>
              </View>
            }
          />
          <Modal
            animationType="fade"
            transparent={true}
            visible={editModalVisible}
            onRequestClose={() => setEditModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Edit Profile</Text>
                  <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                    <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.modalBody}>
                  <Text style={styles.inputLabel}>Username</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="at-outline" size={20} color="#777" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      value={editUsername}
                      onChangeText={setEditUsername}
                      placeholderTextColor="#999"
                    />
                  </View>

                  <View style={styles.permissionBox}>
                    <View>
                      <Text style={styles.permTitle}>Admin Access</Text>
                      <Text style={styles.permDesc}>Grant full administrative control</Text>
                    </View>
                    <Switch
                      value={isAdmin}
                      onValueChange={setIsAdmin}
                      trackColor={{ false: "#E0E5F2", true: "#1B3BBB" }}
                      thumbColor="#fff"
                    />
                  </View>
                </View>

                <TouchableOpacity style={styles.saveBtn} onPress={handleUpdateUser}>
                  <Text style={styles.saveBtnText}>Apply Changes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FE",
  },
  headerArea: {
    padding: 25,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E5F2",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1B3BBB",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
  loader: {
    marginTop: 100,
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  userCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  cardMain: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "#F0F4FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  userEmail: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  adminBadge: {
    backgroundColor: "#E3F2FD",
  },
  userBadge: {
    backgroundColor: "#F5F5F5",
  },
  roleText: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  adminText: {
    color: "#1E88E5",
  },
  userText: {
    color: "#757575",
  },
  editBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F8FAFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E5F2",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 100,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    color: "#999",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(27, 59, 187, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#333",
  },
  modalBody: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#555",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFF",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E0E5F2",
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  permissionBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8FAFF",
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E0E5F2",
  },
  permTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  permDesc: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
  saveBtn: {
    backgroundColor: "#1B3BBB",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    shadowColor: "#1B3BBB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
});

export default ManageUsers;
