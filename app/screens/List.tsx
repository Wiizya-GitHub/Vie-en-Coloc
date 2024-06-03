import { View, Text, Button, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { db } from "../../firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import AjouterTodo from "../components/AddToDo";
import DisplayTask from "../components/DisplayTask";
import { handleLogout } from "../firebase/auth";

const List = ({ navigation }: any) => {
  useEffect(() => {}, []);
  const addTodo = async () => {
    console.log("addTodo");
    const doc = addDoc(collection(db, "todos"), {
      title: "I am a test",
      done: false,
    });
  };
  return (
    <View style={styles.container}>
      <AjouterTodo />
      <Button title="Déconnexion" onPress={() => handleLogout(navigation)} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    //padding: 20,
    marginTop: 20,
  },
});

export default List;
