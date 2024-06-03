import React from 'react';
import { View, StyleSheet } from 'react-native';
import SignUpForm from '../components/SignUpForm';
import { NavigationProp } from '@react-navigation/native';

interface Props {
  navigation: NavigationProp<any, any>;
}

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <SignUpForm navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 32
    //backgroundColor: "rgb(29, 27, 30)"
  },
});

export default SignUpScreen;
