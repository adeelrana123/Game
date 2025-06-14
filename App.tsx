import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './Src/Screens/SplashScreen';
import LoginScreen from './Src/Screens/LoginScreen';
import SignupScreen from './Src/Screens/SignupScreen';
import ForgotPasswordScreen from './Src/Screens/ForgotPasswordScreen';
import BottomTabNavigator from './Src/Navigation/BottomTabNavigator';
import ProfileScreen from './Src/Screens/ProfileScreen';
import ProjuctsScreen from './Src/Screens/ProjuctsScreen';
import UploadVideoScreen from './Src/Screens/UploadVideoScreen';
import SingleVideoScreen from './Src/Screens/SingleVideoScreen';
import LeaderboardScreen from './Src/Screens/LeaderboardScreen';
import SettingsScreen from './Src/Screens/SettingsScreen';
import EnrolledScreen from './Src/Screens/EnrolledScreen';
import ProgressScreen from './Src/Screens/ProgressScreen';


const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="ProjuctsScreen" component={ProjuctsScreen} />
        <Stack.Screen name="UploadVideoScreen" component={UploadVideoScreen} />
        <Stack.Screen name="SingleVideoScreen" component={SingleVideoScreen} />
        <Stack.Screen name="LeaderboardScreen" component={LeaderboardScreen} />
        <Stack.Screen name="ProgressScreen" component={ProgressScreen} />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
        <Stack.Screen name="EnrolledScreen" component={EnrolledScreen} />
        <Stack.Screen name="MainApp" component={BottomTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


export default App;
