import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RecommendTab  from '../../pages/recommend/Recommend';
import MusicTab from '../../pages/MusicPage';
import ToolsTab from '../../pages/ToolsPage';
const Tab = createBottomTabNavigator();
export default function HomeTabs({navigation}) {
    return (
      <Tab.Navigator  screenOptions={{headerShown:false}}>
        <Tab.Screen name="Recommend" component={RecommendTab}  />
        <Tab.Screen name="Music" component={MusicTab} />
        <Tab.Screen name="Tools" component={ToolsTab} />
      </Tab.Navigator>
    );
  }