import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';

import { useNavigation } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
interface headerProps {
  title: string
}

export const Header = (props : headerProps) => {
 const navigation= useNavigation()
//   const {appTheme}=useContext(AppDataContext);
  const {title} = props;
  
  
   
  
  return (
    <View style={[styles.container, { height: 50 }]}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
          <Entypo name="chevron-thin-left" size={26}  style={{marginRight:20,color:'white',}} />
        </TouchableOpacity>
      <Text style={styles.title}>
        {title}
      </Text>
      <View style={{ width: 40 }} >
        <Entypo name="chevron-thin-left" size={22} style={{color:"green",}}/>
        </View>
    </View>
  );
};
const styles = StyleSheet.create({
      container: {
        width: '100%',
        alignItems: 'center',
        backgroundColor:'green',
        elevation: 10,
        flexDirection:"row",
        paddingLeft:20,
        justifyContent:"space-between"
      },
      title: {
        fontSize: 22,
        color:"white",
        fontWeight: 'bold',
       
      },
    });
