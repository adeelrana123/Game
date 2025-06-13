import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { uploadImageToCloudinary } from '../Components/cloudinaryUpload';
import Ionicons from 'react-native-vector-icons/Ionicons';
const ProfileScreen = () => {
  const navigation = useNavigation();
  const [imageUri, setImageUri] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchUserData = async () => {
    try {
      const user = auth().currentUser;
      if (user) {
        const userDoc = await firestore()
          .collection('users')
          .doc(user.email)
          .collection('childData')
          .limit(1)
          .get();

        if (!userDoc.empty) {
          setUserData(userDoc.docs[0].data());
        }
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs access to your camera',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const openCamera = async () => {
    const permission = await requestCameraPermission();
    if (!permission) {
      Alert.alert('Permission denied', 'Cannot access the camera.');
      return;
    }

    const result = await launchCamera({ mediaType: 'photo', quality: 0.8 });
    if (!result.didCancel && !result.errorMessage && result.assets?.length > 0) {
      const uri = result.assets[0].uri;
      console.log('📷 Camera image URI:', uri);
      setImageUri(uri);
    }
  };

  const openGallery = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
    if (!result.didCancel && !result.errorMessage && result.assets?.length > 0) {
      const uri = result.assets[0].uri;
      console.log('🖼️ Gallery image URI:', uri);
      setImageUri(uri);
    }
  };

  const showPickerOptions = () => {
    Alert.alert('Select Image', 'Choose image source', [
      { text: 'Camera', onPress: openCamera },
      { text: 'Gallery', onPress: openGallery },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      const user = auth().currentUser;

      let uploadedUrl = userData?.profileImage;

      if (imageUri) {
        const url = await uploadImageToCloudinary(imageUri);
        if (url) {
          uploadedUrl = url;
        } else {
          Alert.alert('Upload Error', 'Image failed to upload.');
          return;
        }
      }

      if (user && uploadedUrl) {
        const snapshot = await firestore()
          .collection('users')
          .doc(user.email)
          .collection('childData')
          .limit(1)
          .get();

        if (!snapshot.empty) {
          const docId = snapshot.docs[0].id;
          await firestore()
            .collection('users')
            .doc(user.email)
            .collection('childData')
            .doc(docId)
            .update({
              firstName: userData.firstName,
              lastName: userData.lastName,
              username: userData.username,
              profileImage: uploadedUrl,
            });
        }

        Alert.alert('Success', 'Profile updated successfully.', [
          { text: 'OK', onPress: () => navigation.navigate('MainApp') },
        ]);
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setUpdating(false);
    }
  };const handleDeleteImage = () => {
  Alert.alert(
    'Delete Profile Image',
    'Are you sure you want to delete your profile image?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const user = auth().currentUser;
            if (!user) return;

            const snapshot = await firestore()
              .collection('users')
              .doc(user.email)
              .collection('childData')
              .limit(1)
              .get();

            if (!snapshot.empty) {
              const docId = snapshot.docs[0].id;
              await firestore()
                .collection('users')
                .doc(user.email)
                .collection('childData')
                .doc(docId)
                .update({
                  profileImage: firestore.FieldValue.delete(),
                });

              setImageUri(null);
              setUserData({ ...userData, profileImage: null });

              Alert.alert('Deleted', 'Profile image deleted successfully.');
            }
          } catch (error) {
            console.error('Error deleting profile image:', error);
            Alert.alert('Error', 'Failed to delete profile image.');
          }
        },
      },
    ],
    { cancelable: true }
  );
};



  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.header}>My Profile</Text>

      <TouchableOpacity onPress={showPickerOptions} style={styles.imageContainer}>
        {imageUri || userData?.profileImage ? (
          <Image
            source={{ uri: imageUri || userData?.profileImage }}
            style={styles.image}
          />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <Icon name="person" size={60} color="#888" />
          </View>
        )}
       <View style={styles.iconsWrapper}>
  <TouchableOpacity onPress={showPickerOptions} style={styles.iconBtn}>
   <Ionicons name="camera" size={24} color="#fff" />
  </TouchableOpacity>
  {(userData?.profileImage || imageUri) && (
    <TouchableOpacity onPress={handleDeleteImage} style={styles.iconBtn}>
      <Icon name="delete" size={22} color="#fff" />
    </TouchableOpacity>
  )}
</View>


      </TouchableOpacity>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          value={userData?.firstName}
          onChangeText={(text) => setUserData({ ...userData, firstName: text })}
          style={styles.input}
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          value={userData?.lastName}
          onChangeText={(text) => setUserData({ ...userData, lastName: text })}
          style={styles.input}
        />

        <Text style={styles.label}>Username</Text>
        <TextInput
          value={userData?.username}
          onChangeText={(text) => setUserData({ ...userData, username: text })}
          style={styles.input}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          value={userData?.email}
          editable={false}
          style={[styles.input, { backgroundColor: '#eee', color: '#999' }]}
        />
      </View>

      <TouchableOpacity
        style={[styles.updateButton, updating && { opacity: 0.6 }]}
        onPress={handleUpdate}
        disabled={updating}
      >
        <Text style={styles.updateButtonText}>Update Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 50,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 30,
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: '#ccc',
    backgroundColor: '#eee',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 10,
    right: 5,
    backgroundColor: '#0008',
    borderRadius: 20,
    padding: 6,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
 iconsWrapper: {
  position: 'absolute',
  right: 7,
  bottom: 5,
  flexDirection: 'column', 
  alignItems: 'center',
  gap: 8, 
},
iconBtn: {
  backgroundColor: '#0008',
  borderRadius: 20,
  padding: 6,
  marginVertical: 2,
},


});

export default ProfileScreen;
