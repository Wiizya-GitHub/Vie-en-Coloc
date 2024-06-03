import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { signUp } from '../firebase/auth'; // Assurez-vous que cette fonction est correctement exportée depuis /firebase/auth
import { NavigationProp } from '@react-navigation/native';
import { UserProfile } from 'firebase/auth';
import { TextInput, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

interface Props {
  navigation: NavigationProp<any, any>;
}

const SignUpForm: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const handleSignUp = async (): Promise<void> => {
     try {
      const profile = { firstName, lastName /* photoUri */ };
      await signUp(email, password, profile );
      navigation.navigate('Ma colocation'); // Naviguez vers l'écran souhaité après l'inscription réussie
    } catch (error) {
      console.error(error);
    }
  };

  /* const choosePhoto = async () => {
    // Demander la permission d'accéder à la galerie de photos
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    // Sélectionner l'image
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (pickerResult.canceled === true) {
      return;
    }

    // Mettre à jour l'URI de la photo dans l'état local
    setPhotoUri(pickerResult.assets[0].uri);
  }; */

  return (
    <View style={styles.container}>
       <TextInput
      mode='outlined'
      label={"Email"}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
      mode='outlined'
      label={"Mot de passe"}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
      mode='outlined'
      label={"Prénom"}
        placeholder="Prénom"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />
      <TextInput
      mode='outlined'
      label={"Nom"}
        placeholder="Nom"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />
      {/* <Button style={styles.buttons} icon="camera" mode="outlined" onPress={choosePhoto}>Choisir une photo</Button> */}
      <Button style={[styles.buttons, styles.secondButton]}  mode="contained" onPress={handleSignUp}>S'inscrire</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center"
  },
  input: {
    width: '90%',
    margin: 10,
  },
  buttons: {
    marginTop: 12,
    borderColor: '#B2B1CF'
  },
  secondButton: {
    marginTop: 24
  }
});

export default SignUpForm;
