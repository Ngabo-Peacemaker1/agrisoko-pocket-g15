import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppProvider } from './src/context/AppContext';
import { RootStackParamList } from './src/types';

import HomeScreen from './src/screens/HomeScreen';
import AskScreen from './src/screens/AskScreen';
import ResultScreen from './src/screens/ResultScreen';
import DirectoryScreen from './src/screens/DirectoryScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AboutScreen from './src/screens/AboutScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#2e7d32' },
            headerTintColor: '#fff',
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'AgriSoko Pocket G15' }} />
          <Stack.Screen name="Ask" component={AskScreen} options={{ title: 'Ask the Team' }} />
          <Stack.Screen name="Result" component={ResultScreen} options={{ title: 'Result' }} />
          <Stack.Screen name="Directory" component={DirectoryScreen} options={{ title: 'Directory' }} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
          <Stack.Screen name="About" component={AboutScreen} options={{ title: 'About' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}