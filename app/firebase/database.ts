import { db, storage } from "../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export interface UserProfile {
  firstName: string;
  lastName: string;
  /* photoUri: string; */
}

export const createUserProfile = async (
  userId: string,
  profile: UserProfile,
  email: string
): Promise<void> => {
  try {
    // Création de tokens pour le prénom et le nom
    const nameTokens = [
      profile.firstName.toLowerCase(),
      profile.lastName.toLowerCase()
    ];

    // Stockage des informations textuelles dans Firestore
    await setDoc(doc(db, "profiles", userId), {
      userId: userId,
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: email,
      taskCount: 0,
      searchTokens: nameTokens, // Stocker les tokens de recherche
    });

    if (profile.photoUri) {
      // Upload de la photo de profil dans Firebase Storage
      const response = await fetch(profile.photoUri);
      const blob = await response.blob();
      const storageRef = ref(storage, "profilePhotos/" + userId);
      await uploadBytes(storageRef, blob);

      // Mise à jour de l'URL de la photo dans Firestore
      const photoURL = await getDownloadURL(storageRef);
      await setDoc(
        doc(db, "profiles", userId),
        { photoURL },
        { merge: true }
      );
    }

    console.log("Profil créé avec succès");
  } catch (error) {
    console.error("Erreur lors de la création du profil: ", error.message);
  }
};
