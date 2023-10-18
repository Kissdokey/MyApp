import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Focus from '../../pages/recommend/Focus';
import Recommend from '../../pages/recommend/Recommend';
import TabBar from '../../components/Recomend/TabBar';
const Tab = createMaterialTopTabNavigator();
export default  function EnginTabs() {
    return (
      <Tab.Navigator screenOptions={{headerShown: false}} tabBar={props => <TabBar {...props} />}>
        <Tab.Screen name="Recommend" component={Recommend} />
        <Tab.Screen name="Focus" component={Focus} />
      </Tab.Navigator>
    );
  }