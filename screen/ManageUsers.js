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
  StatusBar,
  Dimensions,
} from "react-native";
import { db } from "../firebaseConfig";
import { collection, getDocs, query, doc, updateDoc } from "firebase/firestore";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");

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

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    return parts.length > 1
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0][0].toUpperCase();
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.cardLeft}>
        <View style={[styles.avatar, item.admin && styles.avatarAdmin]}>
          <Text style={[styles.avatarText, item.admin && styles.avatarTextAdmin]}>
            {getInitials(item.username)}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.username || "Anonymous"}</Text>
          <Text style={styles.userEmail} numberOfLines={1}>{item.email}</Text>
          <View style={[styles.rolePill, item.admin ? styles.adminPill : styles.userPill]}>
            <Ionicons
              name={item.admin ? "shield-checkmark" : "person"}
              size={10}
              color={item.admin ? "#4F6DF5" : "#999"}
            />
            <Text style={[styles.roleText, item.admin ? styles.adminRoleText : styles.userRoleText]}>
              {item.admin ? "Admin" : "User"}
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={() => openEditModal(item)} style={styles.editBtn}>
        <Ionicons name="settings-outline" size={18} color="#4F6DF5" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F4FF" />
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Users</Text>
          <Text style={styles.headerSub}>
            {users.length} registered account{users.length !== 1 ? "s" : ""}
          </Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={fetchUsers}>
          <Ionicons name="refresh-outline" size={20} color="#4F6DF5" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#4F6DF5" />
          <Text style={styles.loaderText}>Loading users...</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={users}
            keyExtractor={(item) => item.id}
            renderItem={renderUserItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyWrap}>
                <View style={styles.emptyCircle}>
                  <Ionicons name="people-outline" size={40} color="#C5CAE9" />
                </View>
                <Text style={styles.emptyTitle}>No Users</Text>
                <Text style={styles.emptySub}>Users will appear after registration.</Text>
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
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <View style={styles.modalTitleRow}>
                    <View style={styles.modalTitleIcon}>
                      <Ionicons name="person-circle-outline" size={22} color="#4F6DF5" />
                    </View>
                    <Text style={styles.modalTitle}>Edit User</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setEditModalVisible(false)}
                    style={styles.modalClose}
                  >
                    <Ionicons name="close" size={20} color="#999" />
                  </TouchableOpacity>
                </View>

                {/* Username Field */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Username</Text>
                  <View style={styles.inputRow}>
                    <Ionicons name="at-outline" size={18} color="#9DA5B4" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      value={editUsername}
                      onChangeText={setEditUsername}
                    />
                  </View>
                </View>

                {/* Admin Toggle */}
                <View style={styles.toggleBox}>
                  <View style={styles.toggleInfo}>
                    <Ionicons name="shield-checkmark-outline" size={20} color="#4F6DF5" />
                    <View style={styles.toggleTextGroup}>
                      <Text style={styles.toggleTitle}>Admin Access</Text>
                      <Text style={styles.toggleDesc}>Grant full control</Text>
                    </View>
                  </View>
                  <Switch
                    value={isAdmin}
                    onValueChange={setIsAdmin}
                    trackColor={{ false: "#E8ECF4", true: "#4F6DF5" }}
                    thumbColor="#fff"
                  />
                </View>

                {/* Save Button */}
                <TouchableOpacity style={styles.saveBtn} onPress={handleUpdateUser} activeOpacity={0.85}>
                  <Text style={styles.saveBtnText}>Apply Changes</Text>
                  <Ionicons name="checkmark" size={18} color="#fff" />
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
    backgroundColor: "#F0F4FF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 22,
    paddingTop: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E8ECF4",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0F1B4C",
  },
  headerSub: {
    fontSize: 13,
    color: "#999",
    marginTop: 2,
    fontWeight: "500",
  },
  refreshBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    marginTop: 12,
    color: "#999",
    fontSize: 13,
    fontWeight: "500",
  },
  listContent: {
    padding: 18,
    paddingBottom: 40,
  },

  // User Card
  userCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#0F1B4C",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  avatarAdmin: {
    backgroundColor: "#E3ECFF",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "900",
    color: "#9DA5B4",
  },
  avatarTextAdmin: {
    color: "#4F6DF5",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1a1a2e",
  },
  userEmail: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
    fontWeight: "500",
  },
  rolePill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 6,
    gap: 4,
  },
  adminPill: {
    backgroundColor: "#EEF2FF",
  },
  userPill: {
    backgroundColor: "#F5F5F5",
  },
  roleText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  adminRoleText: {
    color: "#4F6DF5",
  },
  userRoleText: {
    color: "#999",
  },
  editBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },

  // Empty
  emptyWrap: {
    alignItems: "center",
    marginTop: 80,
  },
  emptyCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1a1a2e",
  },
  emptySub: {
    fontSize: 13,
    color: "#999",
    marginTop: 4,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15,27,76,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 24,
    elevation: 12,
    shadowColor: "#0F1B4C",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  modalTitleIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0F1B4C",
  },
  modalClose: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F5F7FB",
    justifyContent: "center",
    alignItems: "center",
  },

  // Fields
  fieldGroup: {
    marginBottom: 18,
  },
  fieldLabel: {
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

  // Toggle
  toggleBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F5F7FB",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "#E8ECF4",
    marginBottom: 24,
  },
  toggleInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  toggleTextGroup: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a2e",
  },
  toggleDesc: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },

  // Save
  saveBtn: {
    backgroundColor: "#0F1B4C",
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    elevation: 6,
    shadowColor: "#0F1B4C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
});

export default ManageUsers;
