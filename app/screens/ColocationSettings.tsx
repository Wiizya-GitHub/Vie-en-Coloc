import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Button,
  FlatList,
} from "react-native";
import { db, auth } from "../../firebaseConfig";
import { collection, query, where, onSnapshot, doc, getDocs, setDoc } from "firebase/firestore";
import AntDesign from '@expo/vector-icons/AntDesign';

const ColocationSettings = ({ navigation }) => {
  const [colocation, setColocation] = useState(null);
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const colocationQuery = query(
        collection(db, "Colocations"),
        where("membres", "array-contains", userId)
      );

      // Utiliser onSnapshot pour les mises à jour en temps réel
      const unsubscribe = onSnapshot(colocationQuery, (querySnapshot) => {
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const colocationData = {
            id: doc.id,
            ...doc.data(),
          };
          setColocation(colocationData);
          fetchInvitations(colocationData.id);
        } else {
          console.log("L'utilisateur n'appartient à aucune colocation.");
        }
      });

      return () => unsubscribe(); // Cleanup on unmount
    }
  }, []);

  async function fetchInvitations(colocationId) {
    const invitationsRef = collection(db, "invitations");
    const q = query(invitationsRef, where("colocationId", "==", colocationId));
    const snapshot = await getDocs(q);
    const fetchedInvitations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setInvitations(fetchedInvitations);
  }

  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (searchText.trim() !== "") {
      const usersRef = collection(db, "profiles");
      const q = query(usersRef, where("email", "==", searchText.toLowerCase()));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSearchResults(results);
      });

      return () => unsubscribe(); // Cleanup subscription on unmount
    } else {
      setSearchResults([]); // Clear results if search is cleared
    }
  }, [searchText]);

  async function inviterUtilisateur(email, colocationId, inviterId) {
    const invitationsRef = collection(db, "invitations");
    const q = query(invitationsRef,
      where("invitedEmail", "==", email),
      where("colocationId", "==", colocationId),
      where("status", "==", "pending")
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      const invitationRef = doc(invitationsRef);
      await setDoc(invitationRef, {
          invitedEmail: email,
          colocationId: colocationId,
          inviterId: inviterId,
          status: "pending"
      });
      console.log("Invitation envoyée à :", email);
    } else {
      console.log("Une invitation existe déjà pour cette personne et cette colocation.");
    }
  }

  const renderItem = ({ item }) => {
    const isInvited = invitations.some(inv => inv.invitedEmail === item.email && inv.status === "pending");
    const isMember = colocation && colocation.membres.includes(item.id);

    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>{item.firstName} {item.lastName}</Text>
        {!isMember && !isInvited && (
          <TouchableOpacity
            style={styles.inviteButton}
            onPress={() => inviterUtilisateur(item.email, colocation.id, auth.currentUser.uid)}
          >
            <AntDesign name="pluscircleo" size={24} color="#BAC757" />
          </TouchableOpacity>
        )}
        {isInvited && (
          <TouchableOpacity>
            <AntDesign name="clockcircle" size={24} color="#E8871E" />
          </TouchableOpacity>
        )}
        {isMember && (
          <AntDesign name="checkcircle" size={24} color="#BAC757" />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>

        <View>
          <Text style={styles.classiqueText}>Inviter un coloc !</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un utilisateur par email"
            value={searchText}
            onChangeText={setSearchText}
            autoCapitalize="none"
          />
          <FlatList
            data={searchResults}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    /* justifyContent: "center",
    alignItems: "center", */
    marginTop: 20,
    paddingBottom: 100
  },
  classiqueText:{
    marginBottom: 8
  },
  searchInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemText: {
    fontSize: 18,
  },
  inviteButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
  },
  inviteButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ColocationSettings;
