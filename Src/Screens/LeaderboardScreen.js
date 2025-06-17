import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Header } from '../Components/Header';

const LeaderboardScreen = () => {
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const snapshot = await firestore().collection('users').get();

        const usersWithChildData = await Promise.all(
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
                username: childData.username ?? user.username ?? 'Unnamed',
                profileImage: childData.profileImage ?? null,
                points: childData.points ?? user.points ?? 0,
              };
            }

            return {
              ...user,
              username: user.username ?? 'Unnamed',
              profileImage: null,
              points: user.points ?? 0,
            };
          })
        );

        const filteredUsers = usersWithChildData.filter(user => user.username && user.points !== undefined);

        const sortedTop = filteredUsers
          .sort((a, b) => b.points - a.points)
          .slice(0, 10);

        setTopUsers(sortedTop);
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
          <Text style={styles.heading}>🏅 Top 10 Users</Text>
          <FlatList
            data={topUsers}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              let backgroundColor = '#fff';
              let medalIcon = null;

              if (index === 0) {
                backgroundColor = '#FFD700'; // Gold
                medalIcon = '🥇';
              } else if (index === 1) {
                backgroundColor = '#C0C0C0'; // Silver
                medalIcon = '🥈';
              } else if (index === 2) {
                backgroundColor = '#CD7F32'; // Bronze
                medalIcon = '🥉';
              }

              return (
                <View style={[styles.userCard, { backgroundColor }]}>
                  <Text style={styles.rank}>
                    {medalIcon ? medalIcon : `${index + 1}.`}
                  </Text>

                  {item.profileImage ? (
                    <Image source={{ uri: item.profileImage }} style={styles.userImage} />
                  ) : (
                    <View style={styles.placeholderImage}>
                      <Icon name="person" size={40} color="#888" />
                    </View>
                  )}

                  <View>
                    <Text style={styles.userName}>{item.username}</Text>
                    <Text style={styles.userPoints}>{item.points} Points</Text>
                  </View>
                </View>
              );
            }}
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
    padding: 10,
    borderRadius: 8,
    elevation: 2,
  },
  rank: {
    fontSize: 22,
    fontWeight: 'bold',
    marginRight: 10,
    width: 40,
    textAlign: 'center',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  placeholderImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
    color: '#333',
  },
});
