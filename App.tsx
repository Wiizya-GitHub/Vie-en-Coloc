import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import List from "./app/screens/List";
import Details from "./app/screens/Details";
import LoginScreen from "./app/screens/Login";
import SignUpScreen from "./app/screens/SignUp";
import CreerColocation from "./app/screens/createColocation";
import InfoColocation from "./app/screens/ColocationView";
import InvitationsScreen from "./app/screens/Invitations";
 import {
  NavigationContainer,
   DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";

import {
  ActivityIndicator,
   MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  adaptNavigationTheme,
} from "react-native-paper";
import merge from "deepmerge";
import { auth } from "./firebaseConfig";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileScreen from "./app/screens/Profile";
import { AuthProvider, useAuth } from "./app/context/AuthContext";
import ColocationSettings from "./app/screens/ColocationSettings";
import { ColocationProvider } from "./app/context/ColocationContext";
import { useColocation } from './app/context/ColocationContext';
import { MyTheme } from "./theme";


/* const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedDefaultTheme = merge(MD3LightTheme, LightTheme);
const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme); */

// Stack Navigator for handling login and signup
const Stack = createNativeStackNavigator();
const ListStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
// Tab Navigator for handling main app screens after login
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: MyTheme.colors.tabBarActiveTintColor,
      tabBarInactiveTintColor: MyTheme.colors.tabBarInactiveTintColor,
    }}>
      <Tab.Screen
        name="ColocationTab"
        component={ListtackScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Coloc",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Invitations"
        component={InvitationsScreen}
        options={{
          tabBarLabel: "Invit",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="flag" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="todo"
        component={List}
        options={{
          tabBarLabel: "List",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="format-list-bulleted"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          headerTitle: "Mon compte",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
// Stack pour les écrans d'authentification
function AuthStackScreen() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="Connexion"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    </AuthStack.Navigator>
  );
}

function ListtackScreen() {
  return (
    <ListStack.Navigator>
      <ListStack.Screen
        name="Ma colocation"
        options={{
          headerShown: false,
        }}
        component={InfoColocation}
      />
      <ListStack.Screen
        name="ColocSettings"
        options={{
          headerShown: true,
          headerBackTitleVisible: false
        }}
        component={ColocationSettings}
      />
      <ListStack.Screen
        name="AddTask"
        options={{
          headerShown: true,
          headerBackTitleVisible: false,
          headerTitle: "Ajouter une tâche"
        }}
        component={List}
      />
      {/* <ListStack.Screen name="ToDo" component={List} options={{}} /> */}
      <ListStack.Screen name="CreerColocation" component={CreerColocation} />
    </ListStack.Navigator>
  );
}

/* const theme = {
  // Specify custom property
  myOwnProperty: true,
  // Specify custom property in nested object
  colors: {
    primary: "rgb(204, 245, 172)",
    onPrimary: "rgb(0, 0, 0)",
    primaryContainer: "rgb(95, 43, 146)",
    onPrimaryContainer: "rgb(240, 219, 255)",
    secondary: "rgb(208, 193, 218)",
    onSecondary: "rgb(54, 44, 63)",
    secondaryContainer: "rgb(77, 67, 87)",
    onSecondaryContainer: "rgb(237, 221, 246)",
    tertiary: "rgb(243, 183, 190)",
    onTertiary: "rgb(75, 37, 43)",
    tertiaryContainer: "rgb(101, 58, 65)",
    onTertiaryContainer: "rgb(255, 217, 221)",
    error: "rgb(255, 180, 171)",
    onError: "rgb(105, 0, 5)",
    errorContainer: "rgb(147, 0, 10)",
    onErrorContainer: "rgb(255, 180, 171)",
    background: "rgb(29, 27, 30)",
    onBackground: "rgb(231, 225, 229)",
    surface: "rgb(29, 27, 30)",
    onSurface: "rgb(231, 225, 229)",
    surfaceVariant: "rgb(74, 69, 78)",
    onSurfaceVariant: "rgb(204, 196, 206)",
    outline: "rgb(150, 142, 152)",
    outlineVariant: "rgb(74, 69, 78)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(231, 225, 229)",
    inverseOnSurface: "rgb(50, 47, 51)",
    inversePrimary: "rgb(120, 69, 172)",
    elevation: {
      level0: "transparent",
      level1: "rgb(39, 35, 41)",
      level2: "rgb(44, 40, 48)",
      level3: "rgb(50, 44, 55)",
      level4: "rgb(52, 46, 57)",
      level5: "rgb(56, 49, 62)",
    },
    surfaceDisabled: "rgba(231, 225, 229, 0.12)",
    onSurfaceDisabled: "rgba(231, 225, 229, 0.38)",
    backdrop: "rgba(51, 47, 55, 0.4)",
  },
}; */

export default function App() {

  /*   const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("Auth state changed:", user);
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []); */
  const { user } = useAuth();

  return (
    <AuthProvider>
      <ColocationProvider>
        <SafeAreaView style={styles.container}>
          <PaperProvider theme={MyTheme}>
            <NavigationContainer theme={MyTheme}>
              <RootNavigator />
            </NavigationContainer>
            </PaperProvider>
        </SafeAreaView>
      </ColocationProvider>
    </AuthProvider>
  );
}
function RootNavigator() {
  const { user, initializing } = useAuth();
  const [loading, setLoading] = useState(true);
  const { colocation, checkUserColocation } = useColocation();

  useEffect(() => {
    const initializeColocation = async () => {
      if (!initializing) {
        try {
          await checkUserColocation();  // Attendre que la vérification de la colocation soit terminée
        } catch (error) {
          console.error("Failed to check colocation:", error);
        }
        setLoading(false);  // Définir le chargement sur false après la fin de la vérification
      }
    };

    initializeColocation();  // Appel de la fonction asynchrone
  }, [initializing]);

  if (loading) {
    // Écran de chargement ou indicateur pendant la vérification de l'état d'authentification
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return user ? <MainTabs /> : <AuthStackScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
});
