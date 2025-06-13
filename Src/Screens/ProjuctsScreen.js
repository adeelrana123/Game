import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import Video from 'react-native-video';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

const ViewVideosScreen = () => {
  const navigation = useNavigation();
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      const user = auth().currentUser;
      if (user) {
        const doc = await firestore().collection('users').doc(user.email).get();
        if (doc.exists && doc.data().videoUrls) {
          setVideos([...doc.data().videoUrls].reverse());
        }
      }
      setLoading(false);
    };

    fetchVideos();
  }, []);

const renderItem = ({ item, index }) => (
  <TouchableOpacity
    style={styles.videoItem}
    onPress={() => navigation.navigate('SingleVideoScreen', { videoUrl: item, videoIndex: index })}
  >
    <Text style={styles.videoTitle}>Video {index + 1}</Text>
  </TouchableOpacity>
);


  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Video Screen</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : videos.length > 0 ? (
          <FlatList
  data={videos}
  renderItem={renderItem}
  keyExtractor={(item, index) => index.toString()}
  contentContainerStyle={{ paddingVertical: 10 }}
/>
      ) : (
        <Text style={{ marginTop: 20, color: '#888' }}>No videos found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, paddingTop: 40 },
  heading: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  videoContainer: {
    width: (screenWidth / 2) - 15,
    height: 180,
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoItem: {
  flex: 1,
  margin: 5,
  padding: 20,
  backgroundColor: '#ddd',
  alignItems: 'center',
  borderRadius: 10,
},
videoTitle: {
  fontSize: 18,
  color: '#333',
},
});

export default ViewVideosScreen;
