import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Component/Login';
import Home from './Component/Home';
import Signup from './Component/Signup';
import Message from './Component/Message';

const Stack = createStackNavigator();
export default function App() {
  return (
    <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Login'>
            <Stack.Screen name="Login" options={{headerShown:false}} component={Login} />
            <Stack.Screen name="Home" options={{headerShown:false}} component={Home} />
            <Stack.Screen name="Signup" options={{headerShown:false}} component={Signup} />
            <Stack.Screen name="Meassge" options={{headerShown:false}} component={Message} />
          </Stack.Navigator>
       </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
