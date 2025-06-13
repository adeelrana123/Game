import { Platform } from 'react-native';

export const uploadVideoToCloudinary = async (videoUri) => {
  const data = new FormData();

  const file = {
    uri: Platform.OS === 'ios' ? videoUri.replace('file://', '') : videoUri,
    type: 'video/mp4',
    name: 'video.mp4',
  };

  data.append('file', file);
  data.append('upload_preset', 'videonew'); // ← your preset name
  data.append('folder', 'newvideo'); // ← optional: asset folder name

  try {
    const res = await fetch('https://api.cloudinary.com/v1_1/dolirbhgf/video/upload', {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const result = await res.json();
    console.log('✅ Video Uploaded:', result);

    return result.secure_url;
  } catch (error) {
    console.error('❌ Upload failed:', error);
    return null;
  }
};
