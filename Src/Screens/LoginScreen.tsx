import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import CheckBox from '@react-native-community/checkbox';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
const [keepSignedIn, setKeepSignedIn] = useState(false);
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
     if (!keepSignedIn) {
      Alert.alert('Alert', 'Please check "Keep me signed in" to continue.');
      return;
    }

    try {
      await auth().signInWithEmailAndPassword(email, password);
      navigation.replace('EnrolledScreen');
    } catch (error) {
      Alert.alert('Login Error', error.message);
    }
  };

  return (
     <View style={{ flex: 1 }}>
    <View style={styles.containers}>
      <Text style={styles.title}>Login </Text>
 </View>
<View style={styles.container}>
      <Text style=
      {styles.toptext}>
        Hi, Welcome
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

   
<View style={styles.checkboxContainer}>
  <View style={styles.leftGroup}>
    <CheckBox
      value={keepSignedIn}
      onValueChange={setKeepSignedIn}
    />
    <Text style={styles.label}>Keep me signed in</Text>
  </View>

  <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
    <Text style={styles.forgotText}>Forgot Password?</Text>
  </TouchableOpacity>
</View>

      
      
      <TouchableOpacity
       onPress={handleLogin}
        style={[styles.loginButton, { backgroundColor: keepSignedIn ? 'green' : 'red' }]}
        disabled={!keepSignedIn}
      >
        <Text style={[styles.buttonText, { color: keepSignedIn ? 'white' : 'white' }]}>
          Login
        </Text>
      </TouchableOpacity>

 

      <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
        <Text style={styles.signupLink}>
  <Text style={styles.signupTextBlack}>Don't have an account? </Text>
  <Text style={styles.signupTextBlue}>Register Now</Text>
</Text>
      </TouchableOpacity>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
    containers: {
        width: '100%',
        alignItems: 'center',
        backgroundColor:'green',
        height:50,
        justifyContent:"center"
      },
      title: {
        fontSize: 22,
        color:"white",
        fontWeight: 'bold',
       textAlign:"center",
       justifyContent:"center"
      },
  container: {
    paddingHorizontal: 20,
    // backgroundColor: '#fff',
    flexGrow: 1,
   
  },
  toptext:{marginBottom:20,
    fontSize:24,
    fontWeight:"bold",
    marginTop:10
  },
  heading: {
    fontSize: 26,
    marginBottom: 20,
    fontWeight: 'bold',
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
  signupLink: {
  textAlign: 'center',
  marginTop: 20,
},

signupTextBlack: {
  color: '#000', 
},

signupTextBlue: {
  color: '#007bff', 
  fontWeight: 'bold',
},
  loginButton: {
  backgroundColor: 'green',
  padding: 15,
  borderRadius: 8,
  alignItems: 'center',
  marginTop: 10,
},

loginButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},
 checkboxContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 20,
},
leftGroup: {
  flexDirection: 'row',
  alignItems: 'center',
},
label: {
  marginLeft: 8,
  fontSize: 14,
  color: '#333',
},
forgotText: {
  fontSize: 14,
  color: '#007bff',
  textDecorationLine: 'underline',
   fontWeight: 'bold',
},
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'green',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
