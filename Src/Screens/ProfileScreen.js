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
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { uploadImageToCloudinary } from '../Components/cloudinaryUpload';
import { Header } from '../Components/Header';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [imageUri, setImageUri] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth().currentUser;
        if (user) {
          const snapshot = await firestore()
            .collection('users')
            .doc(user.email)
            .collection('childData')
            .limit(1)
            .get();

          if (!snapshot.empty) {
            setUserData(snapshot.docs[0].data());
          }
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Cannot access the camera.');
      return;
    }

    const result = await launchCamera({ mediaType: 'photo', quality: 0.8 });
    if (!result.didCancel && !result.errorMessage && result.assets?.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const openGallery = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
    if (!result.didCancel && !result.errorMessage && result.assets?.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const showPickerOptions = () => {
    Alert.alert('Select Image', 'Choose image source', [
      { text: 'Camera', onPress: openCamera },
      { text: 'Gallery', onPress: openGallery },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleDeleteImage = () => {
    Alert.alert('Delete Profile Image', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const user = auth().currentUser;
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
                .update({ profileImage: firestore.FieldValue.delete() });

              setImageUri(null);
              setUserData({ ...userData, profileImage: null });
              Alert.alert('Deleted', 'Profile image removed.');
            }
          } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to delete profile image.');
          }
        },
      },
    ]);
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      const user = auth().currentUser;
      let imageUrl = userData?.profileImage;

      if (imageUri) {
        const uploaded = await uploadImageToCloudinary(imageUri);
        if (!uploaded) {
          Alert.alert('Upload Failed', 'Try again.');
          return;
        }
        imageUrl = uploaded;
      }

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
            profileImage: imageUrl,
          });

        Alert.alert('Success', 'Profile updated.', [
          { text: 'OK', onPress: () => navigation.navigate('MainApp') },
        ]);
      }
    } catch (error) {
      console.error('Update Error:', error);
      Alert.alert('Error', 'Profile update failed.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title="My Profile" />

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 30, alignSelf: 'center' }} />
      ) : (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={showPickerOptions} style={styles.imageContainer}>
            {imageUri || userData?.profileImage ? (
              <Image source={{ uri: imageUri || userData.profileImage }} style={styles.image} />
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
    alignItems: 'center',
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
  iconsWrapper: {
    position: 'absolute',
    right: 7,
    bottom: 5,
    flexDirection: 'column',
    gap: 8,
  },
  iconBtn: {
    backgroundColor: '#0008',
    borderRadius: 20,
    padding: 6,
    marginVertical: 2,
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
});

export default ProfileScreen;
