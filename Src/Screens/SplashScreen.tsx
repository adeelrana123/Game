import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        navigation.replace('MainApp'); 
      } else {
        navigation.replace('LoginScreen'); 
      }
    });

    return unsubscribe; 
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Checking Authentication...</Text>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    marginBottom: 20,
    fontSize: 18,
    color: '#333',
  },
});

export default SplashScreen;
