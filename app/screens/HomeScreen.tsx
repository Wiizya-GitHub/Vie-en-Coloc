import { View, Text, Button, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { db } from '../../firebaseConfig'
import { addDoc, collection } from 'firebase/firestore'
import AjouterTodo from '../components/AddToDo'
import DisplayTask from '../components/DisplayTask'

const HomeScreen = ({ navigation }: any) => {

    useEffect(() => {}, []);
    const addTodo = async () => {
      console.log('addTodo');
      const doc = addDoc(collection(db, 'todos'), {title: 'I am a test', done: false}) }
  return (
    <View style={styles.container}>
      <Text>HomeScreen</Text>
      <AjouterTodo />
      <Button
        title="Créer une colocation"
        onPress={() => navigation.navigate('Creer Colocation')}
      />
      <Button
        title="Ma colocation"
        onPress={() => navigation.navigate('Ma colocation')}
      />
      <Button
        title="Invitations"
        onPress={() => navigation.navigate('Invitations')}
      />
      <DisplayTask />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    padding:20
  },
});

export default HomeScreen;