import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InfoColocation from '../screens/ColocationView';
import CreerColocation from '../screens/createColocation';

const Stack = createNativeStackNavigator();

const ListStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Ma colocation" component={InfoColocation} options={{ headerShown: false }} />
    <Stack.Screen name="CreerColocation" component={CreerColocation} />
  </Stack.Navigator>
);

export default ListStackNavigator;
