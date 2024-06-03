import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LoginForm from '../components/LoginForm';
import { NavigationProp } from '@react-navigation/native';
import { Button } from 'react-native-paper';


interface Props {
  navigation: NavigationProp<any, any>;
}
const LoginScreen: React.FC<Props> = ({ navigation }) => {

  return (
    <View style={styles.container}>
      <LoginForm navigation={navigation}/>
      <Button onPress={() => navigation.navigate('SignUp')} textColor='#A09EBB'>S'inscrire</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    height: '100%',
    //backgroundColor: "rgb(29, 27, 30)"
  },
});

export default LoginScreen;