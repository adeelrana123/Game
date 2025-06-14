import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation, useRoute } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

const ViewVideosScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const selectedLevel = route.params?.selectedLevel || 'Newbie';

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      const user = auth().currentUser;
      if (user) {
        const doc = await firestore().collection('users').doc(user.email).get();
        const data = doc.data();
        if (doc.exists && data?.videoUrls?.[selectedLevel]) {
          setVideos([...data.videoUrls[selectedLevel]].reverse());
        }
      }
      setLoading(false);
    };

    fetchVideos();
  }, [selectedLevel]);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.videoItem}
      onPress={() => navigation.navigate('SingleVideoScreen', { videoUrl: item, videoIndex: index })}
    >
      <Text style={styles.videoTitle}>Video {index + 1}</Text>
    </TouchableOpacity>
  );

  return (

    <View style={{ flex: 1 }}>
        <View style={styles.containers}>
           <Text style={styles.title}>{selectedLevel} Videos</Text>
          
        </View>
    
        <ScrollView style={styles.container}> 
   

     
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
        <Text style={{ marginTop: 20, color: '#888',textAlign:"center" }}>No videos found.</Text>
      )}
      </ScrollView>
    </View>
   
    
  );
};

export default ViewVideosScreen;

const styles = StyleSheet.create({

   container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
    containers: {
        width: '100%',
        alignItems: 'center',
        backgroundColor:'green',
        height:60,
       justifyContent:"center"
        
      },
      title: {
        fontSize: 24,
        color:"white",
        fontWeight: 'bold',
       textAlign:"center",
       justifyContent:"center",
       marginLeft:20
      },
  // container: { flex: 1, padding: 10, paddingTop: 40 },
  // heading: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
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
