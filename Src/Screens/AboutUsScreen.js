import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const AboutUsScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>About Us</Text>

      {/* Video Icon */}
      <View style={styles.iconContainer}>
        <Icon name="play-circle-outline" size={100} color="#f39c12" />
      </View>

      <Text style={styles.paragraph}>
        Welcome to <Text style={styles.appName}>KidVerse</Text> – a joyful and safe space where children can learn, laugh, and grow through videos designed just for them.
      </Text>

      <Text style={styles.paragraph}>
        Our app features carefully selected, fun-filled videos organized into four engaging learning levels:
      </Text>

      {/* Learning Levels */}
      <View style={styles.levelBox}>
        <Text style={styles.levelTitle}>🎈 Newbie</Text>
        <Text style={styles.levelDescription}>Perfect for toddlers starting their journey — basic colors, shapes, and fun songs.</Text>
      </View>

      <View style={styles.levelBox}>
        <Text style={styles.levelTitle}>🚀 Beginner</Text>
        <Text style={styles.levelDescription}>For kids learning letters, numbers, animals, and simple stories.</Text>
      </View>

      <View style={styles.levelBox}>
        <Text style={styles.levelTitle}>🌟 Advanced</Text>
        <Text style={styles.levelDescription}>Fun educational content covering science, rhymes, puzzles, and early logic.</Text>
      </View>

      <View style={styles.levelBox}>
        <Text style={styles.levelTitle}>🏆 Expert</Text>
        <Text style={styles.levelDescription}>Challenge older kids with brain games, facts, and creative storytelling videos.</Text>
      </View>

      <Text style={styles.paragraph}>
        Every video on <Text style={styles.appName}>KidVerse</Text> is ad-free, child-safe, and reviewed by educators to ensure the best screen time experience.
      </Text>

      <Text style={styles.paragraph}>
        Thank you for choosing <Text style={styles.appName}>KidVerse</Text> — your trusted companion in fun and meaningful learning.
      </Text>

      <Text style={styles.contact}>📧 Contact us: support@kidverseapp.com</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#ffffff',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e90ff',
    marginBottom: 16,
    textAlign: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  paragraph: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
    marginBottom: 12,
  },
  appName: {
    fontWeight: 'bold',
    color: '#f39c12',
  },
  levelBox: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#cce5ff',
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e86de',
  },
  levelDescription: {
    fontSize: 15,
    color: '#555',
    marginTop: 4,
  },
  contact: {
    marginTop: 30,
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    textAlign: 'center',
  },
});

export default AboutUsScreen;