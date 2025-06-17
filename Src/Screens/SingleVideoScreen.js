import React from 'react';
import { View, StyleSheet, Dimensions, Alert } from 'react-native';
import Video from 'react-native-video';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const SingleVideoScreen = ({ route }) => {
  const { videoUrl, videoId } = route.params;
  const navigation = useNavigation();

  const handleEnd = async () => {
  try {
    console.log('📽 handleEnd triggered');
    const user = auth().currentUser;
    if (!user) {
      console.log('🚫 No user logged in');
      return;
    }

    const userRef = firestore().collection('users').doc(user.email);
    const childDataSnap = await userRef.collection('childData').limit(1).get();

    if (childDataSnap.empty) {
      console.log('🚫 No data found in childData');
      return;
    }

    const childDoc = childDataSnap.docs[0];
    const data = childDoc.data();

    const prevPoints = data.points || 0;
    const watchedVideos = data.watchedVideos || [];
    const currentIndex = data.currentVideoIndex || 0;
    const videoUrls = data.videoUrls || [];

    if (watchedVideos.includes(videoId)) {
     if (watchedVideos.includes(videoId)) {
  Alert.alert(
    'ℹ️ Info',
    'You already watched this video.',
    [
      {
        text: 'OK',
        onPress: () => navigation.goBack(), // 👈 Go back on OK
      },
    ],
    { cancelable: false }
  );
  return;
}

      return;
    }

    const updatedWatched = [...watchedVideos, videoId];
    const newIndex = Math.min(currentIndex + 1, videoUrls.length); // safely increase index

    await childDoc.ref.set(
      {
        points: prevPoints + 5,
        watchedVideos: updatedWatched,
        currentVideoIndex: newIndex,
      },
      { merge: true }
    );

    console.log('✅ Points and index updated');

    Alert.alert('✅ Success', 'You earned 5 points for watching this video!', [
      {
        text: 'OK',
        onPress: () => setTimeout(() => navigation.goBack(), 500),
      },
    ]);
  } catch (err) {
    console.error('❌ handleEnd error:', err?.message || err);
    Alert.alert('Error', 'Something went wrong.');
  }
};


  return (
    <View style={styles.container}>
      <Video
        source={{ uri: videoUrl }}
        style={styles.video}
        controls
        resizeMode="contain"
        onEnd={handleEnd}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: width,
    height: height * 0.8,
  },
});

export default SingleVideoScreen;
