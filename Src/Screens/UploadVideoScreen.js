import React, { useState } from 'react';
import { View, Button, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { uploadVideoToCloudinary } from '../Components/videocloudinaryUpload';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const UploadVideoScreen = () => {
  const [uploading, setUploading] = useState(false);

  const pickVideo = async () => {
    const result = await launchImageLibrary({ mediaType: 'video' });
    if (!result.didCancel && result.assets?.length > 0) {
      setUploading(true);
      const uri = result.assets[0].uri;
      const uploadedUrl = await uploadVideoToCloudinary(uri);

      if (uploadedUrl) {
        const user = auth().currentUser;
        if (user) {
          await firestore()
            .collection('users')
            .doc(user.email)
            .set({
              videoUrls: firestore.FieldValue.arrayUnion(uploadedUrl),
            }, { merge: true });
        }

        Alert.alert('Success', 'Video uploaded and saved to Firebase!');
      } else {
        Alert.alert('Error', 'Video upload failed.');
      }
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Select and Upload Video" onPress={pickVideo} />
      {uploading && <ActivityIndicator size="large" color="blue" style={{ marginTop: 20 }} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
});

export default UploadVideoScreen;
