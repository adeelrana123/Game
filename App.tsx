import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './Src/Screens/SplashScreen';
import LoginScreen from './Src/Screens/LoginScreen';
import SignupScreen from './Src/Screens/SignupScreen';
import ForgotPasswordScreen from './Src/Screens/ForgotPasswordScreen';
import BottomTabNavigator from './Src/Navigation/BottomTabNavigator';  // Tab contains HomeScreen internally
import ProfileScreen from './Src/Screens/ProfileScreen';
import ProjuctsScreen from './Src/Screens/ProjuctsScreen';
import UploadVideoScreen from './Src/Screens/UploadVideoScreen';
import SingleVideoScreen from './Src/Screens/SingleVideoScreen';

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
        {/* This will load your tab navigation (with Home, Profile, etc.) */}
        <Stack.Screen name="MainApp" component={BottomTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
