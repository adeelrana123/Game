import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import * as Progress from 'react-native-progress';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Header } from '../Components/Header';

const ProgressScreen = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progressPercent, setProgressPercent] = useState(0);
  const [activeCourse, setActiveCourse] = useState('0/0');
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth().currentUser;
      if (!user) return;

      const userRef = firestore().collection('users').doc(user.email);

      try {
        const childDataSnapshot = await userRef.collection('childData').limit(1).get();
        if (!childDataSnapshot.empty) {
          const childData = childDataSnapshot.docs[0].data();
          setUserData(childData);
        }

        const userDoc = await userRef.get();
        if (userDoc.exists) {
          const data = userDoc.data();
          const watched = [...new Set(data?.watchedVideos ?? [])];
          const totalVideos = data?.videoUrls?.length ?? 0;
          const progress = totalVideos > 0 ? (watched.length / totalVideos) * 100 : 0;

          setProgressPercent(progress.toFixed(0));
          setActiveCourse(`${data.currentVideoIndex ?? 0}/${totalVideos}`);
          setPoints(data.points ?? 0);
        }

      } catch (error) {
        console.error('🔥 Error fetching user data:', error);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <View style={styles.fullContainer}>
      <View style={styles.headerContainer}>
        <Header title="My Progress" />
      </View>

      {loading ? (
        <View style={styles.centerLoader}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          {userData && (
            <View style={styles.userInfo}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {userData?.profileImage ? (
                  <Image source={{ uri: userData.profileImage }} style={styles.image} />
                ) : (
                  <View style={[styles.image, styles.placeholder]}>
                    <Icon name="person" size={60} color="#888" />
                  </View>
                )}
                <Text style={styles.name}>{userData?.username ?? 'No name'}</Text>
              </View>

              <Text style={styles.stat}>📊 Progress: {progressPercent}%</Text>
              <View style={{ width: '100%', marginTop: 10 }}>
                <Progress.Bar
                  progress={progressPercent / 100}
                  width={null}
                  color="#4caf50"
                  unfilledColor="#e0e0e0"
                  borderWidth={0}
                  height={8}
                  style={{ alignSelf: 'stretch' }}
                />
              </View>
              <Text style={styles.stat}>🎓 Active Course: {activeCourse}</Text>
              <Text style={styles.stat}>⭐ Points: {points}</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default ProgressScreen;

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  headerContainer: {
    width: '100%',
  },
  centerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 20,
  },
  userInfo: {
    marginBottom: 30,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 20,
  },
  stat: {
    fontSize: 16,
    marginTop: 15,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
});
