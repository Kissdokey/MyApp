import * as React from 'react';
import {
  Button,
  Text,
  View,
  TouchableHighlight,
  StyleSheet,
  ScrollView,
  StatusBar
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Settings from '../OtherPages/setting';
import Erciyuan from './songTypePage';
import MusiPlay from '../MusicPlayPage';
import LickPage from './lickPage';
import host from '../../host';
import MusicHeader from '../MusicPage';
const Tab = createMaterialTopTabNavigator();
export default function Recommend({}) {
  return (
    <Tab.Navigator screenOptions={{
      tabBarLabelStyle: { fontSize: 12 },
      tabBarItemStyle: { width: 100 },
      tabBarStyle: { backgroundColor: 'powderblue',height:60,paddingTop:15 },
      tabBarAndroidRipple: { borderless: false },
      tabBarPressColor:'',
      tabBarActiveTintColor:'black',
      tabBarInactiveTintColor:'white',
      tabBarBounces:true,
      tabBarShowIcon:true,
      tabBarScrollEnabled:true,
      tabBarIndicatorStyle:{
        backgroundColor:'rgb(140,102,255)',
        height:34,
        width:80,
        borderRadius:8,
        margin:8,
        marginBottom:3
      }
    }}>
      <Tab.Screen name="Erciyuan" options={{title:"二次元"}} >{(props)=><Erciyuan {...props} type="二次元"></Erciyuan>}</Tab.Screen>
      <Tab.Screen name="Gufeng" options={{title:"古风"}} >{(props)=><Erciyuan {...props} type="古风"></Erciyuan>}</Tab.Screen>
      <Tab.Screen name="Youxibibei" options={{title:"游戏必备"}} >{(props)=><Erciyuan {...props} type="游戏必备"></Erciyuan>}</Tab.Screen>
      <Tab.Screen name="Resou" options={{title:"热搜"}} component={MusicHeader} /> 
      <Tab.Screen name="like" options={{title:"我喜欢的"}} component={LickPage} /> 
    </Tab.Navigator>
  );
}
const styles = StyleSheet.create({
  headerHighlight: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'yellow',
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: 15,
    marginRight: 15,
  }
});
