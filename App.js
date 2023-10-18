import * as React from 'react';
import {Button, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AppStack from './src/router/stack/AppStack';
import store from './src/store/store';
import {Provider} from 'react-redux';
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="app" component={AppStack} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
