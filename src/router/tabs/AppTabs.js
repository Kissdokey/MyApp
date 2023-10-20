import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RecommendTab  from '../../pages/recommend/Recommend';
import MusicTab from '../../pages/MusicPage';
import SettingPage from '../../pages/SettingPage';
const Tab = createBottomTabNavigator();
export default function HomeTabs({navigation}) {
    return (
      <Tab.Navigator  screenOptions={{headerShown:false}}>
        <Tab.Screen name="Music" component={RecommendTab}  />
        <Tab.Screen name="News" component={SettingPage} />
        <Tab.Screen name="AppSetting" component={SettingPage} />
      </Tab.Navigator>
    );
  }