import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import InvitationsScreen from '../screens/Invitations';
import ProfileScreen from '../screens/Profile';
import ListStackNavigator from './ListStackNavigator';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Ma colocation" component={ListStackNavigator} options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="home" color={color} size={size} /> }} />
    <Tab.Screen name="Invitations" component={InvitationsScreen} options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="flag" color={color} size={size} /> }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account" color={color} size={size} /> }} />
  </Tab.Navigator>
);

export default MainTabNavigator;
