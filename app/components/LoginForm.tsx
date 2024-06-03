import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { auth } from '../../firebaseConfig';
import { NavigationProp, useIsFocused, useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from "firebase/auth";
import { TextInput, Button } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackActions } from '@react-navigation/native';


const LoginForm = (props) => {
  const {navigation}=props;
  const isFocused = useIsFocused();
   const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  /* useEffect(() => {
    console.log('Effect running');
    const unsubscribe = auth.onAuthStateChanged(user => {
      console.log('Auth state changed:', user);
      if (user) {
        console.log('Current navigation state:', navigation.getState());
        navigation.replace('todo');



      }
    });
    return unsubscribe;
  }, [navigation, isFocused]); */

  const handleLogin = async (): Promise<void> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      Alert.alert("Erreur", "Échec de la connexion: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
      outlineColor='#000'
        placeholder="Email"
        label={"Email"}
        mode='outlined'
        onChangeText={setEmail}
        value={email}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ margin: 10, width: '90%' }}
      />
      <TextInput
      outlineColor='#000'
        placeholder=""
        label={"Mot de passe"}
        mode='outlined'
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        style={{ margin: 10, width: '90%'  }}
      />
      <Button style={styles.buttons} mode="contained" onPress={handleLogin}>Se connecter</Button>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  buttons:{
    marginTop: 12,
    borderRadius: 8
  }
});

export default LoginForm;
