import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();

  const [videos, setVideos] = useState([]);
  const [watchedVideos, setWatchedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [userData, setUserData] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const fetchUserData = async () => {
    try {
      const user = auth().currentUser;
      if (user) {
        const userRef = firestore().collection('users').doc(user.email);

        const childDataSnapshot = await userRef.collection('childData').limit(1).get();
        if (!childDataSnapshot.empty) {
          const childData = childDataSnapshot.docs[0].data();
          setUserData(childData);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVideos = async () => {
    try {
      const levelFromRoute = route.params?.selectedLevel;
      const levelFromStorage = await AsyncStorage.getItem('selectedLevel');
      const level = levelFromRoute || levelFromStorage || 'Newbie';

      setSelectedLevel(level);

      const snapshot = await firestore()
        .collection('videos')
        .where('level', '==', level)
        .orderBy('uploadedAt', 'desc')
        .get();

      const list = snapshot.docs.map(doc => ({
        videoUrl: doc.data().videoUrl,
        videoId: doc.id,
      }));

      setVideos(list);

      const user = auth().currentUser;
      if (user) {
        const userRef = firestore().collection('users').doc(user.email);
        await userRef.set(
          { videoUrls: list.map(v => v.videoUrl) },
          { merge: true }
        );

        const childDataSnap = await userRef.collection('childData').limit(1).get();
        if (!childDataSnap.empty) {
          const data = childDataSnap.docs[0].data();
          setWatchedVideos(data?.watchedVideos || []);
          setCurrentVideoIndex(data?.currentVideoIndex || 0);
        }
      }
    } catch (err) {
      console.error('❌ Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchUserData();
      fetchVideos();
    }
  }, [isFocused]);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const renderItem = ({ item, index }) => {
    const isWatched = watchedVideos.includes(item.videoId);
    return (
      <TouchableOpacity
        style={styles.videoItem}
        onPress={() =>
          navigation.navigate('SingleVideoScreen', {
            videoUrl: item.videoUrl,
            videoId: item.videoId,
          })
        }
      >
        <View style={styles.row}>
          <Text style={styles.videoTitle}>Video {index + 1}</Text>
          {isWatched && <Icon name="check-circle" size={24} color="green" />}
        </View>
      </TouchableOpacity>
    );
  };

  const totalVideos = videos.length;
  const watchedCount = videos.filter(v => watchedVideos.includes(v.videoId)).length;
  const progressPercent = totalVideos > 0 ? (watchedCount / totalVideos) * 100 : 0;

 

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

          <Text style={styles.title}>{userData?.username || 'User'}</Text>

          <TouchableOpacity style={styles.topbottom} onPress={toggleDropdown}>
            <Entypo name="dots-three-vertical" size={30} color="white" />
          </TouchableOpacity>

          {dropdownVisible && (
            <View style={styles.dropdownAbsolute}>
              <TouchableOpacity onPress={() => navigation.navigate('UploadVideoScreen')}>
                <Text>Upload Video</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        

       <View style={{ flex: 1, padding: 10 }}>
  <Text style={[styles.titles, { color: 'black' }]}>{selectedLevel} Videos</Text>

  <View style={styles.progressContainer}>
    <Text style={styles.progressText}>
      Watched {watchedCount} of {totalVideos} videos
    </Text>
    <View style={styles.progressBarBackground}>
      <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
    </View>
    <Text style={styles.percentageText}>
      {Math.round(progressPercent)}% completed
    </Text>
  </View>

  {loading ? (
    <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
  ) : totalVideos > 0 ? (
    <FlatList
      data={videos}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={{ paddingVertical: 10 }}
    />
  ) : (
    <Text style={styles.noVideos}>No videos found.</Text>
  )}
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
    marginLeft: 20,
  },
   titles: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    // marginLeft: 20,
  },
  topbottom: {
    marginLeft: 'auto',
    marginRight: 10,
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
  dropdownAbsolute: {
    position: 'absolute',
    top: 60,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    elevation: 5,
    zIndex: 1000,
  },
  progressContainer: {
    marginVertical: 10,
  },
  progressText: {
    fontSize: 14,
  },
  progressBarBackground: {
    height: 10,
    width: '100%',
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginVertical: 5,
  },
  progressBarFill: {
    height: 10,
    backgroundColor: 'green',
    borderRadius: 5,
  },
  percentageText: {
    fontSize: 14,
    color: '#555',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 8,
    elevation: 2,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  noVideos: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 30,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
