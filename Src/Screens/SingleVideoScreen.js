import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Video from 'react-native-video';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const SingleVideoScreen = ({ route }) => {
  const { videoUrl, videoIndex } = route.params;

  const handleEnd = async (videoIndex) => {
    const user = auth().currentUser;
    if (!user) return;

    const userRef = firestore().collection('users').doc(user.email);
    const userSnap = await userRef.get();

    if (!userSnap.exists) return;

    const prevPoints = userSnap.data().points || 0;
    const watchedVideos = userSnap.data().watchedVideos || [];

    if (watchedVideos.includes(videoIndex)) return;

    const updatedWatched = [...watchedVideos, videoIndex];

    await userRef.set(
      {
        points: prevPoints + 5,
        currentVideoIndex: videoIndex + 1,
        watchedVideos: updatedWatched,
      },
      { merge: true }
    );
  };

  return (
    <ScrollView 
    keyboardShouldPersistTaps="handled"
    contentContainerStyle={styles.container}>
      <View style={styles.container}>
        <Video
          source={{ uri: videoUrl }}
          style={styles.video}
          controls
          resizeMode="contain"
          onEnd={() => handleEnd(videoIndex)}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
 container: { flex: 1, backgroundColor: '#000' },
  video: { flex: 1 },
});

export default SingleVideoScreen;
