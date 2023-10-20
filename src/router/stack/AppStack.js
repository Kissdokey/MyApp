import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeTabs from '../tabs/AppTabs';
import MusicPlay from '../../pages/OtherPages/MusicPlay';
import Settings from '../../pages/OtherPages/setting';
import {
  Button,
  Text,
  View,
  ScrollView,
  Alert,
  FlatList,
  TouchableHighlight,
  StyleSheet,
  TouchableWithoutFeedback,
  StatusBar,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  pushItem,
  nextPlay,
  lastPlay,
  onChangeDefaultVolume,
  setCurrentIndex,
  setPlayerStyle,
} from '../../store/playListSlice';
import MusicPlayer from '../../components/Recomend/MusicPlayer';
import {setUrlContext,Covers} from '../../Context/context';
const Stack = createNativeStackNavigator();
export default function AppStack({navigation}) {
  const [url, setUrl] = React.useState('');
  const [playTypeIndex, setPlayTypeIndex] = React.useState(0);
  const [isNoticeMsgShow, setIsNoticeMsgShow] = React.useState(false);
  const playTypeMsg = ['列表循环', '单曲循环', '随机播放'];
  let timer = null;
  let styleType = useSelector(state => {
    return state.list.playerStyle;
  });
  function onChangeType() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    } else {
      setIsNoticeMsgShow(true);
    }
    timer = setTimeout(() => {
      if (timer) {
        setIsNoticeMsgShow(false);
        clearTimeout(timer);
        timer = null;
      }
    }, 400);
  }
  return (
    <View style={{flex: 1, position: 'relative'}}>
      <StatusBar
        translucent={true}
        backgroundColor="rgba(0, 0, 0, 0)"
        barStyle={'light-content'}
      />
      <setUrlContext.Provider value={setUrl}>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Home" component={HomeTabs} />
          <Stack.Screen name="MusicPlay" component={MusicPlay} />
          <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>
      </setUrlContext.Provider>
      {isNoticeMsgShow && (
        <View style={styles.noticeMsg}>
          <Text>{playTypeMsg[playTypeIndex]}</Text>
        </View>
      )}
      {url && (
        <MusicPlayer
          url={url}
          setUrl={setUrl}
          playType={{playTypeIndex, setPlayTypeIndex}}
          onChangeType={onChangeType}
          playerStyle={styleType}
          navigation={navigation}></MusicPlayer>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  noticeMsg: {
    width: 100,
    height: 40,
    position: 'absolute',
    alignSelf: 'center',
    top: 70,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 5,
    shadowColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
