import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import EnrolledScreen from '../Screens/EnrolledScreen';
import SettingsScreen from '../Screens/ProjuctsScreen';
import QuestionScreen from '../Screens/QuestionScreen';
import HomeScreen from '../Screens/HomeScreen';
import ProjuctsScreen from '../Screens/ProjuctsScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: 'green',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Enrolled') {
            iconName = 'book-outline';
          } else if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Projucts') {
            iconName = 'trophy';
          } else if (route.name === 'Question') {
            iconName = 'help-circle-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Projucts" component={ProjuctsScreen} />
      <Tab.Screen name="Enrolled" component={EnrolledScreen} />
      {/* <Tab.Screen name="Profile" component={ProfileScreen} /> */}
      {/* <Tab.Screen name="Settings" component={SettingsScreen} /> */}
      <Tab.Screen name="Question" component={QuestionScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
