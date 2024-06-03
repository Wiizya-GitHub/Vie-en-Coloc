import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, ScrollView } from "react-native";
import { auth, db } from "../../firebaseConfig";
import SegmentedControlTab from "react-native-segmented-control-tab";
import { collection, getDocs, doc, updateDoc, query, where } from "firebase/firestore";
import { Checkbox, Switch, useTheme } from "react-native-paper";
import CheckBox from "react-native-check-box";
import { useColocation } from "../context/ColocationContext";
import { MyTheme } from "../../theme";
//import { colors } from "react-native-elements";

const DisplayTask = () => {
  const { colors, fonts } = useTheme(); // Accéder aux couleurs définies dans votre thème
  const styles = getStyles(colors, fonts); // Obtenir les styles avec les couleurs du thème
  const { colocation } = useColocation();  // Utilisez le hook ici pour accéder à la colocation
  const [todos, setTodos] = useState([]);
  const [selectedIndexHebdo, setSelectedIndexHebdo] = useState(0);
  const [selectedIndexMens, setSelectedIndexMens] = useState(0);
  const [users, setUsers] = useState({});
  const [filterHebdo, setFilterHebdo] = useState("mine"); // 'all', 'mine'
  const [filterMens, setFilterMens] = useState("mine"); // 'all', 'mine'

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollectionRef = collection(db, "profiles");
      const querySnapshot = await getDocs(usersCollectionRef);
      const usersList = {};
      querySnapshot.docs.forEach((doc) => {
        usersList[doc.id] = doc.data().firstName + " " + doc.data().lastName;
      });
      setUsers(usersList);
    };

    const fetchTodos = async () => {
      const todosCollectionRef = collection(db, "todos");
      const colocationQuery = query(todosCollectionRef, where("colocationId", "==", colocation.id));
      const querySnapshot = await getDocs(colocationQuery);
      setTodos(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    };

    fetchUsers();
    fetchTodos();
  }, []);

  // Gère le changement de sélection pour afficher 'Mes Tâches' ou 'Toutes'
  const handleSegmentChangeHebdo = (indexHebdo) => {
    setSelectedIndexHebdo(indexHebdo);
    setFilterHebdo(indexHebdo === 0 ? "mine" : "all");
  };
  const handleSegmentChangeMens = (indexMens) => {
    setSelectedIndexMens(indexMens);
    setFilterMens(indexMens === 0 ? "mine" : "all");
  };

  const filteredTasksHebdo =
    filterHebdo === "mine"
      ? todos.filter((todo) => todo.assignedTo === auth.currentUser.uid)
      : todos;
  const filteredTasksMens =
    filterMens === "mine"
      ? todos.filter((todo) => todo.assignedTo === auth.currentUser.uid)
      : todos;
  const toggleTodo = async (id, etat) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, etat: !etat };
      }
      return todo;
    });
    setTodos(newTodos);

    const todoDocRef = doc(db, "todos", id);
    await updateDoc(todoDocRef, {
      etat: !etat,
    });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.h3}>Tâches Journalières</Text>
      <FlatList
        data={todos.filter((todo) => todo.recurrence === "Journalière")}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem task={item} users={users} onToggle={toggleTodo} />
        )}
      />
      <Text style={styles.h3}>Tâches Hebdomadaires</Text>
      <SegmentedControlTab
        tabsContainerStyle={styles.tabsContainerStyle}
        tabStyle={styles.tabStyle}
        firstTabStyle={styles.firstTabStyle}
        lastTabStyle={styles.lastTabStyle}
        tabTextStyle={styles.tabTextStyle}
        activeTabStyle={styles.activeTabStyle}
        activeTabTextStyle={styles.activeTabTextStyle}
        values={["Mes Tâches", "Toutes"]}
        selectedIndex={selectedIndexHebdo}
        onTabPress={handleSegmentChangeHebdo}
      />
      <FlatList
        style={styles.TaskItemContainer}
        data={filteredTasksHebdo.filter((todo) => todo.recurrence === "Hebdomadaire")}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem task={item} users={users} onToggle={toggleTodo} />
        )}
      />
      <Text style={styles.h3}>Tâches Mensuelles</Text>
      <SegmentedControlTab
        tabsContainerStyle={styles.tabsContainerStyle}
        tabStyle={styles.tabStyle}
        firstTabStyle={styles.firstTabStyle}
        lastTabStyle={styles.lastTabStyle}
        tabTextStyle={styles.tabTextStyle}
        activeTabStyle={styles.activeTabStyle}
        activeTabTextStyle={styles.activeTabTextStyle}
        values={["Mes Tâches", "Toutes"]}
        selectedIndex={selectedIndexMens}
        onTabPress={handleSegmentChangeMens}
      />
      <FlatList
        style={styles.TaskItemContainer}
        data={filteredTasksMens.filter((todo) => todo.recurrence === "Mensuelle")}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem task={item} users={users} onToggle={toggleTodo} />
        )}
      />
    </View>
  );
};

const TaskItem = ({ task, users, onToggle }) => {
  // État local pour suivre si la tâche est cochée ou non
  const { colors, fonts } = useTheme(); // Accéder aux couleurs définies dans votre thème
  const styles = getStyles(colors, fonts); // Obtenir les styles avec les couleurs du thème
  const [isChecked, setIsChecked] = useState(task.etat);
  const handleToggle = () => {
    const newStatus = !isChecked;
    setIsChecked(newStatus);
    onToggle(task.id, newStatus);
  };
  const itemStyle = isChecked ? styles.todoItemChecked : styles.todoItem;
  const textStyle = isChecked ? styles.textChecked : styles.itemTitle;

  return (
    <View style={itemStyle}>
      <CheckBox
        style={{ marginRight: 8, borderRadius: 20 }}
        onClick={handleToggle}
        isChecked={isChecked}
      />
      <View style={styles.todoText}>
        <Text style={textStyle}>{task.titre}</Text>
        <Text style={styles.itemUserName}>
          {users[task.assignedTo] || "Tous"}
        </Text>
      </View>
    </View>
  );
};

const getStyles = (colors, fonts) => StyleSheet.create({
  containerScroll: {
    height: '100%',
  },
  container: {
    /* marginTop: 20,
    paddingBottom: 100 */
  },
  checkboxContainer: {
    borderRadius: 2,
    borderWidth: 1, // Définir l'épaisseur du contour
    borderColor: "#000", // Définir la couleur du contour
    padding: 0, // Optionnel: pour un peu d'espace autour de la checkbox
  },
  TaskItemContainer:{
    marginTop: 16
  },
  h3:{
    fontSize : 16,
    marginVertical : 8
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.accent,
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 0,
    justifyContent: "space-between",
    borderRadius: 8,
  },
  todoText: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemTitle: {
    //fontSize: 18,
    //color: 'white'
  },
  itemUserName: {
    fontSize: 14,
    fontStyle: "italic",
  },
  /*   todoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e2e2e2",
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    justifyContent: "space-between",
  }, */
  todoItemChecked: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d9e0a3", // une couleur différente pour les tâches complétées
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 0,
    justifyContent: "space-between",
    borderRadius: 8,
    //opacity: 0.6
  },
  textChecked: {
    //fontSize: 18,
    textDecorationLine: "line-through", // barrer le texte pour les tâches complétées
    color: "#666", // couleur grise pour le texte des tâches complétées
  },
  tabsContainerStyle: {
    //custom styles
  },
  tabStyle: {
    //custom styles
    //backgroundColor: 'red'
    borderColor: '#5D4E6D'
  },
  firstTabStyle: {
    //custom styles
    //backgroundColor: 'red'
  },
  lastTabStyle: {
    //custom styles
  },
  tabTextStyle: {
    //custom styles
    color: "black"
  },
  activeTabStyle: {
    //custom styles
    backgroundColor: '#001210'

  },
  activeTabTextStyle: {
    //custom styles
    color: "white"
  },
  tabBadgeContainerStyle: {
    //custom styles
  },
  activeTabBadgeContainerStyle: {
    //custom styles
  },
  tabBadgeStyle: {
    //custom styles
  },
  activeTabBadgeStyle: {
    //custom styles
  }
});

export default DisplayTask;
