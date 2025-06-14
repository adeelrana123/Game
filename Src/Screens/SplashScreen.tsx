import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();

 useEffect(() => {
  const unsubscribe = auth().onAuthStateChanged((user) => {
    if (!user) {
      navigation.replace('LoginScreen');
    } else {
      navigation.replace('EnrolledScreen');
    }
  });

  return unsubscribe;
}, []);


  return (
    <View style={styles.container}>
      <Text style={styles.logo}>My App</Text>
      <ActivityIndicator size="large" color="#00ff00" />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
