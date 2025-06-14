import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
export default function SettingsScreen() {
  const navigation = useNavigation();

  const settingsOptions = [
     
    { title: 'Edit Profile', icon: 'person', screen: 'ProfileScreen' },
    { title: 'My Progress', icon: 'bar-chart', screen: 'ProgressScreen' },
     { title: 'Leader Board', icon: 'emoji-events', screen: 'LeaderboardScreen' },
   { title: 'Courses', icon: 'menu-book', screen: 'EnrolledScreen' },
    { title: 'Privacy Policy', icon: 'security', screen: 'PrivacyPolicyScreen' }, 
    { title: 'Terms of Service', icon: 'description', screen: 'TermsScreen' },  
   
    { title: 'Change Password', icon: 'lock', screen: 'ForgotPassword' },
    { title: 'Logout', icon: 'logout', action: 'logout' },
  ];

 const handlePress = async (item) => {
  if (item.action === 'logout') {
    try {
      await auth().signOut();
      navigation.replace('LoginScreen');
    } catch (error) {
      console.error('Logout failed:', error);
    }
    return;
  }

  if (item.screen) {
    navigation.navigate(item.screen);
  }
};

return (
  <View style={{ flex: 1 }}>
    <View style={styles.containers}>
      <Text style={styles.title}>Settings</Text>
    </View>

    <ScrollView style={styles.container}>
      {settingsOptions.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.optionContainer}
          onPress={() => handlePress(item)}
        >
          <Icon name={item.icon} size={24} color="#4A4A4A" style={styles.icon} />
          <Text style={styles.optionText}>{item.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
    containers: {
        width: '100%',
        alignItems: 'center',
        backgroundColor:'green',
        height:60,
       justifyContent:"center"
        
      },
      title: {
        fontSize: 24,
        color:"white",
        fontWeight: 'bold',
       textAlign:"center",
       justifyContent:"center",
       marginLeft:20
      },

  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  icon: {
    marginRight: 15,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
});