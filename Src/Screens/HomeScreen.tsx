import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import * as Progress from 'react-native-progress';

const HomeScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ image: null });
  const [watchedCount, setWatchedCount] = useState(0);
  const [totalVideos, setTotalVideos] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [points, setPoints] = useState(0);
  const [activeCourse, setActiveCourse] = useState('0/0');
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const fetchUserData = async () => {
    try {
      const user = auth().currentUser;
      if (user) {
        const userRef = firestore().collection('users').doc(user.email);

        const childDataSnapshot = await userRef.collection('childData').limit(1).get();
        if (!childDataSnapshot.empty) {
          setUserData(childDataSnapshot.docs[0].data());
        }

        const mainDoc = await userRef.get();
        if (mainDoc.exists) {
          const data = mainDoc.data();
          const videoList = data.videoUrls || [];
          const watched = data.watchedVideos || [];
          const uniqueWatched = [...new Set(watched)];

          setTotalVideos(videoList.length);
          setWatchedCount(uniqueWatched.length);

          const progress = videoList.length > 0 ? (uniqueWatched.length / videoList.length) * 100 : 0;
          setProgressPercent(progress.toFixed(0));
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchUserData();
    }
  }, [isFocused]);

  useEffect(() => {
    const fetchPoints = async () => {
      const user = auth().currentUser;
      if (user) {
        const userDoc = await firestore().collection('users').doc(user.email).get();
        const pointsVal = userDoc.data()?.points ?? 0;
        const currentIndex = userDoc.data()?.currentVideoIndex ?? 0;
        const totalVideos = userDoc.data()?.videoUrls?.length ?? 0;

        setPoints(pointsVal);
        setActiveCourse(`${currentIndex}/${totalVideos}`);
      }
    };

    if (isFocused) {
      fetchPoints();
    }
  }, [isFocused]);

  const handleLogout = async () => {
    await auth().signOut();
    navigation.replace('LoginScreen');
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={() => dropdownVisible && setDropdownVisible(false)}>
      <View style={{ flex: 1 }}>
        <View style={styles.containers}>
          <TouchableOpacity style={styles.imageContainer}>
            {userData?.profileImage ? (
              <Image source={{ uri: userData.profileImage }} style={styles.image} />
            ) : (
              <View style={[styles.image, styles.placeholder]}>
                <Icon name="person" size={60} color="#888" />
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.title}>{userData?.username}</Text>

          <TouchableOpacity style={styles.topbottom} onPress={toggleDropdown}>
            <Entypo name="dots-three-vertical" size={30} color="white" />
          </TouchableOpacity>

          {dropdownVisible && (
            <View style={styles.dropdownAbsolute}>
              <TouchableOpacity onPress={handleLogout}>
                <Text style={styles.dropdownItem}>Logout</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.container}>
          <View style={styles.box}>
            <Ionicons name="book-outline" size={30} color="black" />
            <Text style={styles.pointsText}>{points}</Text>
            <Text>Enrolled Courses</Text>
          </View>

          <View style={styles.box}>
            <Entypo name="graduation-cap" size={30} color="black" />
            <Text style={styles.pointsText}>{activeCourse}</Text>
            <Text>Active Courses</Text>
          </View>

          <View style={styles.box}>
            <Entypo name="trophy" size={30} color="black" />
            <Text style={styles.text}>Videos Completed</Text>
            <Text style={styles.text}>{progressPercent}% Progress</Text>
            <Progress.Bar
              progress={progressPercent / 100}
              width={190}
              height={15}
              color="#4caf50"
              borderRadius={5}
            />
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('UploadVideoScreen')}>
            <Text>Upload Video</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  containers: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'green',
    height: 60,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    position: 'relative',
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    justifyContent: 'center',
    marginLeft: 20,
  },
  topbottom: {
    marginLeft: 'auto',
    marginRight: 10,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownAbsolute: {
    position: 'absolute',
    top: 60,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    elevation: 5,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  dropdownItem: {
    fontSize: 14,
    color: 'black',
    paddingVertical: 5,
  },
  box: {
    width: '60%',
    height: 150,
    borderWidth: 1,
    borderColor: 'black',
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    marginLeft: 10,
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
  pointsText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 18,
    marginBottom: 8,
  },
});

export default HomeScreen;
