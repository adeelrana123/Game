import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Button,
  ActivityIndicator,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { uploadVideoToCloudinary } from '../Components/videocloudinaryUpload'; // Your Cloudinary uploader

const levels = ['Newbie', 'Beginner', 'Advanced', 'Expert'];

const UploadVideoScreen = () => {
  const [uploading, setUploading] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);

  const pickVideo = async () => {
    if (!selectedLevel) {
      Alert.alert('Error', 'Please select a level first.');
      return;
    }

    const result = await launchImageLibrary({ mediaType: 'video' });

    if (!result.didCancel && result.assets?.length > 0) {
      setUploading(true);
      const uri = result.assets[0].uri;

      try {
        const uploadedUrl = await uploadVideoToCloudinary(uri);

        if (uploadedUrl) {
          const user = auth().currentUser;

          // Add video to Firestore "videos" collection
          const videoRef = await firestore().collection('videos').add({
            uploaderEmail: user.email,
            videoUrl: uploadedUrl,
            level: selectedLevel,
            uploadedAt: firestore.FieldValue.serverTimestamp(),
          });

          // Add video ID to user's videoUrls array
          await firestore().collection('users').doc(user.email).set(
            {
              videoUrls: firestore.FieldValue.arrayUnion(videoRef.id),
            },
            { merge: true }
          );

          Alert.alert('Success', `Video uploaded under ${selectedLevel}`);
        } else {
          Alert.alert('Error', 'Video upload failed.');
        }
      } catch (err) {
        console.error('Upload error:', err);
        Alert.alert('Error', 'Something went wrong during upload.');
      }

      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Select Level</Text>
      <View style={styles.levelContainer}>
        {levels.map((level, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.levelButton,
              selectedLevel === level && styles.selectedLevel,
            ]}
            onPress={() => setSelectedLevel(level)}
          >
            <Text style={styles.levelText}>{level}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button title="Select & Upload Video" onPress={pickVideo} />
      {uploading && (
        <ActivityIndicator size="large" color="blue" style={{ marginTop: 20 }} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  levelContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  levelButton: {
    padding: 10,
    margin: 5,
    backgroundColor: '#ccc',
    borderRadius: 8,
  },
  selectedLevel: {
    backgroundColor: 'green',
  },
  levelText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default UploadVideoScreen;
