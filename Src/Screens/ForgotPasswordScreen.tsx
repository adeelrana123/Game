import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import { Header } from '../Components/Header';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    try {
      await auth().sendPasswordResetEmail(email);
      Alert.alert('Success', 'Password reset email sent!');
      navigation.goBack(); 
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.containers}>
        <View >
<Header title='Reset Your Password' />
        </View>
        <View style={styles.container}>
      <Text> Lost your password? Please enter your  email address. You will receive a link to create a new password via email.</Text>
<Text style={styles.textname}>Email</Text>
      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
<TouchableOpacity onPress={handleResetPassword} style={styles.button}>
    <Text style={styles.buttonText}>
       Reset Password 
    </Text>
</TouchableOpacity>
       </View>
    </View>
  );
};

const styles = StyleSheet.create({
     containers: {
    backgroundColor: '#fff',
    flex: 1,
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
   input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    marginBottom: 15,
    borderRadius: 10,
    height:50,
    backgroundColor:"#B0C4DE"
  },
   button: {
  backgroundColor: 'green',
  padding: 15,
  borderRadius: 8,
  alignItems: 'center',
  marginTop: 10,
},
buttonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},
textname:{
    marginBottom:5,
    marginTop:25
}
});

export default ForgotPasswordScreen;
