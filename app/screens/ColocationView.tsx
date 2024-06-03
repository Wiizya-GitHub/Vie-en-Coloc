import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Button,
  FlatList,
  ScrollView,
} from "react-native";
import { db, auth } from "../../firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { useColocation } from "../context/ColocationContext";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { Title, useTheme } from "react-native-paper";
import DisplayTask from "../components/DisplayTask";

const InfoColocation = ({ navigation }) => {
  //const [colocation, setColocation] = useState(null);
  const { colocation, checkUserColocation } = useColocation();
  const { colors, fonts } = useTheme(); // Accéder aux couleurs définies dans votre thème
  const styles = getStyles(colors, fonts); // Obtenir les styles avec les couleurs du thème
  return (
    <View style={styles.container}>
      {colocation ? (
        <View>
          <View style={styles.header}>
            <Text style={styles.title}>{colocation.nom}</Text>
            <View style={styles.settingButton}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("ColocSettings")}
              >
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons name="cog" size={24} color="#000" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView>
            <View style={styles.containerInScroll}>
              <View style={styles.taskSettings}>
                <Text style={styles.h2}>Les tâches</Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => navigation.navigate("AddTask")}
                >
                  <View style={styles.iconContainer}>
                    <AntDesign name="pluscircleo" size={20} color="black" />
                  </View>
                </TouchableOpacity>
              </View>
              <DisplayTask></DisplayTask>
            </View>
          </ScrollView>
        </View>
      ) : (
        <View style={styles.buttonsContainer}>
          <Button
            title="Créer une colocation"
            onPress={() => navigation.navigate("CreerColocation")}
          />
          <Button
            title="Voir mes invitations"
            onPress={() => navigation.navigate("Invitations")}
          />
        </View>
      )}
    </View>
  );
};

const getStyles = (colors, fonts) =>
  StyleSheet.create({
    buttonsContainer:{
      flex:1,
      justifyContent: "center"
    },
    container: {
      /*     flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: '100%' */
      height: "100%",
      backgroundColor: "white",
      marginTop: 0,
      paddingBottom: 40,
    },
    containerInScroll: {
      marginTop: 20,
      paddingBottom: 10,
    },
    taskSettings:{
      display: 'flex',
      flexDirection: "row",
      //justifyContent: "space-between",
      alignItems: "center",
      gap: 8,
    },
    h2: {
      fontSize : 18,
    },
    header: {
      //width: '100%'
      alignItems: "center",
      //display: 'flex'
    },
    button: {
      //backgroundColor: '#007AFF', // iOS blue color
      padding: 10,
      borderRadius: 5,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    iconContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      color: "#fff",
      paddingLeft: 10,
    },
    title: {
      fontSize: 20,
      paddingVertical: 10,
    },
    settingButton: {
      position: "absolute",
      top: 0,
      right: 0,
    },
    searchInput: {
      padding: 10,
      borderWidth: 1,
      borderColor: "#ddd",
      marginBottom: 20,
    },
    itemContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
    },
    itemText: {
      fontSize: 18,
    },
    inviteButton: {
      backgroundColor: "#4CAF50",
      padding: 10,
      borderRadius: 5,
    },
    inviteButtonText: {
      color: "white",
      fontWeight: "bold",
    },
  });

export default InfoColocation;
