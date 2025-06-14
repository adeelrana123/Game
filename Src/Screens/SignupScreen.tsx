// SignupScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Header } from '../Components/Header';

const SignupScreen = ({ navigation })  => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

 const handleSignup = async () => {
  if (!firstName.trim()) {
    Alert.alert('Missing Field', 'Please enter your First Name');
    return;
  }
  if (!lastName.trim()) {
    Alert.alert('Missing Field', 'Please enter your Last Name');
    return;
  }
  if (!username.trim()) {
    Alert.alert('Missing Field', 'Please enter your Username');
    return;
  }
  if (!email.trim()) {
    Alert.alert('Missing Field', 'Please enter your Email');
    return;
  }
  if (!password) {
    Alert.alert('Missing Field', 'Please enter your Password');
    return;
  }
  if (!confirmPassword) {
    Alert.alert('Missing Field', 'Please confirm your Password');
    return;
  }

  if (password !== confirmPassword) {
    Alert.alert('Error', 'Passwords do not match');
    return;
  }

  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    await firestore()
      .collection('users')
      .doc(email) // or use user.uid if preferred
      .collection('childData')
      .doc()
      .set({
        firstName,
        lastName,
        username,
        email,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

    Alert.alert('Success', 'User registered successfully!');
    navigation.replace('EnrolledScreen');
  } catch (error) {
    Alert.alert('Signup Error', error.message);
  }
};


  return (
    <View style={styles.containers}>
         <View >
                
        <Header title='Signup' />
                </View>
      
<ScrollView>

<View style={styles.container}> 
<Text style={styles.textname}>First Name</Text>
      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />
<Text style={styles.textname}>Last Name</Text>
      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />
<Text style={styles.textname}>Username</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
<Text style={styles.textname}>Email</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
<Text style={styles.textname}>Password</Text>
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
<Text style={styles.textname}>Confirm Password</Text>
      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />
      </View>
      </ScrollView>
      <View >
     <TouchableOpacity onPress={handleSignup} style={styles.button}>
  <Text style={styles.buttonText}>Register</Text>
</TouchableOpacity>
 </View>
</View>
 
  );
};

const styles = StyleSheet.create({
    containers: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
   
  },
  heading: {
    fontSize: 26,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textname:{marginBottom:5},
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
});

export default SignupScreen;
