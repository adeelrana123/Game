import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Header } from '../Components/Header';

const options = ['Newbie', 'Beginner', 'Advanced', 'Expert'];

const EnrolledScreen = ({navigation}) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSubmit = () => {
    if (selectedOption !== null) {
      Alert.alert('Selected Level', options[selectedOption]);
      navigation.navigate('ProjuctsScreen')
    } else {
      Alert.alert('Please select a level');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <Header  title='Select Level'/>
      </View>

      <View style={styles.container}>
        {options.map((label, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.option,
              selectedOption === index && styles.optionSelected,
            ]}
            onPress={() => setSelectedOption(index)}
          >
            <View style={styles.checkbox}>
              {selectedOption === index && <View style={styles.checked} />}
            </View>
            <Text style={styles.optionLabel}>{label}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EnrolledScreen;

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    padding: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 10,
    backgroundColor: '#B0C4DE',
  },
  optionSelected: {
    borderColor: 'green',
    backgroundColor: '#d0f0c0',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#333',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#333',
  },
  optionLabel: {
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});