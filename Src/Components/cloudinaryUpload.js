// cloudinaryUpload.js
import { Platform } from 'react-native';

export const uploadImageToCloudinary = async (imageUri) => {
  const data = new FormData();

  const file = {
    uri: Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri,
    type: 'image/jpeg',
    name: 'profile.jpg',
  };

  data.append('file', file);
  data.append('upload_preset', 'Imagephoto'); // Your unsigned preset

  try {
    const res = await fetch('https://api.cloudinary.com/v1_1/dolirbhgf/image/upload', {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const result = await res.json();
    console.log('✅ Cloudinary Result:', result);

    if (result.secure_url) {
      return result.secure_url;
    } else {
      console.error('❌ Cloudinary Error:', result);
      return null;
    }
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
    return null;
  }
};
