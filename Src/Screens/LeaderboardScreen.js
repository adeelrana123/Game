import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Header } from '../Components/Header';

const LeaderboardScreen = () => {
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const snapshot = await firestore()
          .collection('users')
          .orderBy('points', 'desc')
          .limit(10)
          .get();

        const top = await Promise.all(
          snapshot.docs.map(async doc => {
            const user = doc.data();
            const childSnapshot = await firestore()
              .collection('users')
              .doc(doc.id)
              .collection('childData')
              .limit(1)
              .get();

            if (!childSnapshot.empty) {
              const childData = childSnapshot.docs[0].data();
              return {
                ...user,
                username: childData.username ?? user.username,
                profileImage: childData.profileImage ?? null,
              };
            }

            return user;
          })
        );

        setTopUsers(top);
      } catch (error) {
        console.error('🔥 Error fetching leaderboard:', error);
      }

      setLoading(false);
    };

    fetchTopUsers();
  }, []);

  return (
    <View style={styles.fullContainer}>
      <View style={styles.headerContainer}>
        <Header title="Leaderboard" />
      </View>

      {loading ? (
        <View style={styles.centerLoader}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={styles.heading}>🏆 Top 10 Users</Text>
          <FlatList
            data={topUsers}
            scrollEnabled={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.userCard}>
                <Text style={styles.rank}>{index + 1}.</Text>
                {item.profileImage ? (
                  <Image source={{ uri: item.profileImage }} style={styles.userImage} />
                ) : (
                  <View style={styles.placeholderImage}>
                    <Icon name="person" size={40} color="#888" />
                  </View>
                )}
                <View>
                  <Text style={styles.userName}>{item.username ?? 'Unnamed'}</Text>
                  <Text style={styles.userPoints}>{item.points} Points</Text>
                </View>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default LeaderboardScreen;

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
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    elevation: 2,
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
    width: 20,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  placeholderImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userPoints: {
    fontSize: 16,
    color: '#666',
  },
});
