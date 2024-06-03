import { auth } from '../../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { createUserProfile, UserProfile } from './database';
import { NavigationProp } from '@react-navigation/native';

interface Props {
  navigation: NavigationProp<any, any>;
}

export const signUp = async (email: string, password: string, profile: UserProfile): Promise<void> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('Compte créé avec succès');
    const userId = userCredential.user.uid;
    // Assuming the UserProfile is available here, otherwise, pass it as a parameter
    await createUserProfile(userId, profile, email);
  } catch (error) {
    console.error("Erreur lors de la création du compte: ", error);
  }
};

export const signIn = async (email: string, password: string): Promise<void> => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log('Connecté avec succès');
  } catch (error) {
    console.error("Erreur lors de la connexion: ", error);
  }
};


export const handleLogout = async (navigation) => {
  try {
    await auth.signOut();
    alert("Vous êtes déconnecté.");
  } catch (error) {
    alert("Erreur lors de la déconnexion : " + error.message);
  }
};
