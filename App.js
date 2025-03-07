
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TimerProvider } from './context/TimerContext';
import HomeScreen from './screens/HomeScreen';
import HistoryScreen from './screens/HistoryScreen';
import AddTimerScreen from './screens/AddTimerScreen';
import ThemeProvider from './context/ThemeContext';
import { StatusBar } from 'react-native';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <TimerProvider>
        <NavigationContainer>
          <StatusBar />
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === 'Home') {
                  iconName = focused ? 'timer' : 'timer-outline';
                } else if (route.name === 'History') {
                  iconName = focused ? 'list' : 'list-outline';
                } else if (route.name === 'Add Timer') {
                  iconName = focused ? 'add-circle' : 'add-circle-outline';
                }
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#3498db',
              tabBarInactiveTintColor: 'gray',
            })}
          >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Add Timer" component={AddTimerScreen} />
            <Tab.Screen name="History" component={HistoryScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </TimerProvider>
    </ThemeProvider>
  );
}

