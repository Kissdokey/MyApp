import * as React from 'react';
import { Button, StyleSheet, Text, View,Pressable, Image} from 'react-native';
export default  function MusiPlay({ route,navigation }) {
    return (
      <View >
       <View style={styles.header}>
        <Pressable style={styles.gobackbutton}>
            <Image source={require('../assets/goback/goback-pink.png')} style={styles.goback}></Image>
        </Pressable>
        <Text style={styles.name}>111</Text>
        <Text style={styles.artists}>111</Text>
        <Text style={styles.artists}>111</Text>
       </View>
      </View>
    );
  }
  const styles = StyleSheet.create({
    header:{
        height:80,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'white',
        position:'relative'
    },
    name:{
        fontSize:16,
        fontWeight:'600'
    },
    artists:{
        fontSize:12,
        fontWeight:'300'
    },
    goback:{
        width:20,
        height:20,
    },
    gobackbutton: {
        position:'absolute',
        left:10
    }
  })