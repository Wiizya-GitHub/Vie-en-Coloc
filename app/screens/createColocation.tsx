import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { db, auth, storage } from "../../firebaseConfig"; // Importez auth depuis firebaseConfig
import { collection, addDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
const CreerColocation = ({ navigation }) => {
  const [nom, setNom] = useState("");
  const [adresse, setAdresse] = useState("");
  const [photo, setPhoto] = useState(null); // Pour stocker l'image sélectionnée
  const [userId, setUserId] = useState("");

  useEffect(() => {
    // Récupérer l'utilisateur actuellement connecté
    const user = auth.currentUser;
    if (user) {
      // Récupérer l'ID de l'utilisateur
      setUserId(user.uid);
    }
  }, []);

  // Fonction pour ouvrir la galerie de photos et sélectionner une image
  const choisirPhoto = async () => {
    try {
      // Demander la permission de l'utilisateur pour accéder à la galerie de photos
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission refusée",
          "Vous devez autoriser l'accès à la galerie de photos pour choisir une image."
        );
        return;
      }

      // Ouvrir la galerie de photos pour sélectionner une image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        // Mettre à jour l'état avec l'image sélectionnée
        setPhoto(result);
        console.log("URI de l'image sélectionnée :", result.assets[0].uri); // Ajoutez cette ligne pour débogagesetPhoto(result);
      }
    } catch (error) {
      console.error("Erreur lors de la sélection de l'image : ", error);
    }
  };

  const uploadImageAsync = async (uri, nom) => {
    console.log("Uploading image");
    const response = await fetch(uri);
    console.log(response)
    const blob = await response.blob();
    const fileRef = ref(storage, `colocations/${nom}/${new Date().toISOString()}`);
    await uploadBytes(fileRef, blob);
    return await getDownloadURL(fileRef);
  };

  // Fonction pour créer une nouvelle colocation
  const creerColocation = async () => {
    console.log('click')
    if (nom && userId) {
      // Télécharger l'image et obtenir son URL
      console.log('nom & user id ok')
      const photoURL = await uploadImageAsync(photo.assets[0].uri, nom);

      // Créer la colocation avec l'URL de la photo
      await addDoc(collection(db, "Colocations"), {
        nom: nom,
        adresse : adresse,
        photo: photoURL,
        membres: [ userId ],
      });

      // Réinitialiser les champs
      setNom("");
      setAdresse("");
      setPhoto(null);
      setUserId("");

      // Redirection
      navigation.navigate("ColocationTab"); // Assurez-vous que 'Accueil' est bien le nom de votre page d'accueil
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={nom}
        onChangeText={setNom}
        placeholder="Nom de la colocation"
        style={styles.input}
      />
      <TextInput
        value={adresse}
        onChangeText={setAdresse}
        placeholder="Adresse de la colocation"
        style={styles.input}
      />
      {photo && (
        <Image
          source={{ uri: photo.assets[0].uri }}
          style={{ width: 200, height: 200, marginBottom: 10 }}
        />
      )}
      {/* Bouton pour choisir une photo */}
      <Button title="Choisir une photo" onPress={choisirPhoto} />
      <Button title="Créer une colocation" onPress={creerColocation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  input: {
    paddingVertical: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default CreerColocation;
