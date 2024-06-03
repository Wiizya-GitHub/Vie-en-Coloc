import React, { useEffect, useMemo, useState } from "react";
import { View, TextInput, StyleSheet, Text } from "react-native";
import { Button } from "react-native-paper";
import RadioGroup, { RadioButtonProps } from "react-native-radio-buttons-group";
import SelectDropdown from "react-native-select-dropdown";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  documentId,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { auth } from "../../firebaseConfig";
import { useColocation } from "../context/ColocationContext"; // Assurez-vous que le chemin est correct

const AjouterTodo = () => {
  const [titre, setTitre] = useState("");
  const [members, setMembers] = useState([]);
  const { colocation } = useColocation(); // Utilisez le hook ici pour accéder à la colocation
  const [recurrence, setRecurrence] = useState("");
  const [selectedId, setSelectedId] = useState("1"); // Initialisation avec l'ID de l'option par défaut
  const recurrences = ["Journalière", "Hebdomadaire", "Mensuelle", "Unique"];
  const db = getFirestore();

  const radioButtons: RadioButtonProps[] = useMemo(
    () => [
      {
        id: "1",
        label: "Aléatoirement à chaque récurrence",
        value: "random",
        selected: true, // Démarre avec cette option sélectionnée
      },
      {
        id: "2",
        label: "À tout le monde",
        value: "everyone",
      },
    ],
    []
  );

  useEffect(() => {
    const fetchMembers = async () => {
      const user = auth.currentUser;
      if (user) {
        const colocationQuery = query(
          collection(db, "Colocations"),
          where("membres", "array-contains", user.uid)
        );
        const colocationSnapshot = await getDocs(colocationQuery);
        if (!colocationSnapshot.empty) {
          const colocationData = colocationSnapshot.docs[0].data();
          const memberIds = colocationData.membres;

          const usersQuery = query(
            collection(db, "profiles"),
            where(documentId(), "in", memberIds)
          );
          const usersSnapshot = await getDocs(usersQuery);
          const users = usersSnapshot.docs.map((doc) => ({
            id: doc.id,
            name: `${doc.data().firstName} ${doc.data().lastName}`,
            taskCount: doc.data().taskCount || 0, // Assurez-vous d'initialiser `taskCount` lorsque vous créez un utilisateur
          }));
          setMembers(users);
        }
      }
    };
    fetchMembers();
  }, []);

  const ajouterElement = async () => {
    if (!colocation) {
      console.log("Aucune colocation trouvée");
      return;
    }
    const assignOption = radioButtons.find(
      (option) => option.id === selectedId
    )?.value;
    if (titre && recurrence) {
      if (assignOption === "random") {
        // Assigner aléatoirement à un membre pour chaque récurrence
        const randomUser = members[Math.floor(Math.random() * members.length)];
        await addTask(titre, recurrence, randomUser.id);
        setTitre("");
        setRecurrence("");
        alert("Tâche ajoutée avec succès!");
      } else if (assignOption === "everyone") {
        // Assigner la tâche pour tous, sans préciser l'ID de l'utilisateur
        await addTask(titre, recurrence, null);
        setTitre("");
        setRecurrence("");
        alert("Tâche ajoutée pour tous avec succès!");
      }
    } else {
      alert("Veuillez remplir tous les champs requis.");
    }
  };

  const addTask = async (titre, recurrence, assignedTo) => {
    await addDoc(collection(db, "todos"), {
      titre,
      recurrence,
      assignedType: assignedTo ? "individual" : "everyone",
      assignedTo: assignedTo, // Peut être null si la tâche est pour tous
      colocationId: colocation.id,
      etat: false,
    });
    // Si assigné individuellement, mise à jour du compteur de tâches
    if (assignedTo) {
      const userRef = doc(db, "profiles", assignedTo); // Crée une référence de document
      // Utiliser getDoc au lieu de getDocs pour récupérer un seul document
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        await updateDoc(userRef, {
          taskCount: (userSnapshot.data().taskCount || 0) + 1,
        });
      } else {
        console.log("No such user!");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.formLabel}>Nom de la tâche</Text>
      <TextInput
        value={titre}
        onChangeText={setTitre}
        placeholder="Ex : Sortir les poubelles"
        style={styles.input}
      />
      <Text style={styles.formLabel}>Récurrence</Text>
      <SelectDropdown
        data={recurrences}
        onSelect={(selectedItem) => setRecurrence(selectedItem)}
        renderButton={(selectedItem, isOpened) => (
          <View style={styles.dropdownButtonStyle}>
            <Text style={styles.dropdownButtonText}>
              {selectedItem || "Sélectionner la récurrence"}
            </Text>
          </View>
        )}
        renderItem={(item) => (
          <View style={styles.dropdownItemStyle}>
            <Text>{item}</Text>
          </View>
        )}
        dropdownStyle={styles.dropdownMenuStyle}
      />
      <Text style={styles.formLabel}>Assigner</Text>
      <RadioGroup
        containerStyle={styles.containerRadioGroup}
        radioButtons={radioButtons}
        onPress={setSelectedId}
        selectedId={selectedId}
      />
{/*       <Button icon="camera" mode="contained" onPress={ajouterElement}>

      </Button> */}
      <Button icon="" mode="contained" onPress={ajouterElement} style={styles.buttonStyle}>
    Ajouter
  </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    //padding: 20,
  },
  formLabel: {
    fontSize: 16,
    margin: 8,
    color: "#000",
  },
  buttonStyle:{
    width: 100,
    alignSelf: "flex-end",
    borderRadius: 8
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  dropdownButtonStyle: {
    width: "100%",
    height: 40,
    backgroundColor: "#fdf2b0",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownButtonText: {
    fontSize: 16,
    color: "#000",
  },
  dropdownItemStyle: {
    padding: 10,
  },
  dropdownMenuStyle: {
    maxHeight: 140,
  },
  containerRadioGroup: {
    justifyContent: "center",
    alignItems: "flex-start",
  },
});

export default AjouterTodo;
