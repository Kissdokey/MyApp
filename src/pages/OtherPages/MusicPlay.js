import * as React from 'react';
import {
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  View,
  Pressable,
  ImageBackground,
  TouchableWithoutFeedback,
  ScrollView,
  BackHandler,
} from 'react-native';
import host from '../../host';
import MusicPlayer from '../../components/Recomend/MusicPlayer';
import {useDispatch, useSelector} from 'react-redux';
import {
  setLikeInfoList,
  addLikeInfo,
  deleteLikeInfo,
  deleteLikeSong,
  addLikeSong,
  ifLike,
  pushItem,
  nextPlay,
  lastPlay,
  onChangeDefaultVolume,
  setCurrentIndex,
  setPlayerStyle,
  setLyricInfo,
} from '../../store/playListSlice';
import YunLyricAnalysis from '../../tool/analysisLyric';
export default function MusicPlay({route, navigation}) {
  const {id, info} = route.params;
  const [state, setState] = React.useState(2); //0loading,1err,2success
  const [lyric, setLyric] = React.useState([]);
  const [klyric, setKlyric] = React.useState('');
  const [tlyric, settlyric] = React.useState('');
  const [data, setData] = React.useState({});
  const [errorMsg, setErrorMsg] = React.useState('');
  const [clickFn, setClickFn] = React.useState(true);
  const [scrollInfo, setScrollInfo] = React.useState({});
  const [scrollHeight, setScrollHeight] = React.useState(0);
  const myActive = React.useRef(null);
  const scrollWindow = React.useRef(null);
  const dispatch = useDispatch();
  const keylyric = useSelector(state => {
    return state.list.keylyric;
  });
  const list = useSelector(state => {
    return state.list.playList;
  });
  const likeList = useSelector(state => {
    return state.list.likeList;
  });
  const currentPosition = useSelector(state => {
    return state.list.currentPosition;
  });
  React.useEffect(() => {
    if (!scrollWindow.current) {
      return;
    }
    scrollWindow.current.measure(
      (frameX, frameY, frameWidth, frameHeight, pageX, pageY) => {
        console.log('wwheg', frameHeight); // 当前组件的高度
        console.log('wwtop', pageY); // 当前组件距离顶部的距离
        setScrollInfo({height: frameHeight, top: pageY});
      },
    );
  }, [scrollWindow]);
  React.useEffect(() => {
    console.log("mounted")
    if (!myActive.current) {
      return;
    }
    myActive.current.measure(
      (frameX, frameY, frameWidth, frameHeight, pageX, pageY) => {
        let distance =
          frameHeight / 2 + pageY - scrollInfo.top - scrollInfo.height / 2;
        scrollWindow.current.scrollTo({
          x: 0,
          y: scrollHeight + distance,
          animated: true,
        });
        setScrollHeight(scrollHeight < 0 ? 0 : scrollHeight + distance);
      },
    );
  }, [myActive.current]);
  React.useEffect(() => {
    dispatch(setPlayerStyle(1));
    const fetchLyric = () => {
      if (id in keylyric) {
        setLyric(keylyric[id]);
        return;
      }
      fetch(`${host}/lyric?id=${id}`)
        .then(res => {
          return res.json();
        })
        .then(res => {
          let analysiser = new YunLyricAnalysis(res?.lrc?.lyric || '');
          let lyricInfo = analysiser.getlyricInfo();
          setLyric(lyricInfo);
          dispatch(setLyricInfo({id: id, lyricInfo: lyricInfo}));
        });
    };
    fetchLyric();
  }, [id]);
  function selectIflike() {
    if (!clickFn) {
      return;
    }
    setClickFn(false);
    let index = likeList.indexOf(id);
    if (index === -1) {
      fetch(`${host}/like?id=${id}`)
        .then(res => {
          return res.json();
        })
        .then(res => {
          if (res.code === 200) {
            Alert.alert('喜欢成功');

            dispatch(addLikeSong(id));
            fetch(`${host}/song/detail?ids=${id}`)
              .then(res => {
                return res.json();
              })
              .then(res => {
                dispatch(addLikeInfo(res.songs[0]));
                setClickFn(true);
              });
          }
        });
    } else {
      fetch(`${host}/like?id=${id}&like=false`)
        .then(res => {
          return res.json();
        })
        .then(res => {
          if (res.code === 200) {
            Alert.alert('取消喜欢成功');
            index = likeList.indexOf(id);
            dispatch(deleteLikeSong(index));
            dispatch(deleteLikeInfo(index));
            setClickFn(true);
          }
        });
    }
  }
  React.useEffect(() => {
    function goback() {
      navigation.navigate('Home');
      dispatch(setPlayerStyle(0));
      return true;
    }
    BackHandler.addEventListener('hardwareBackPress', goback);

    BackHandler.removeEventListener('hardwareBackPress', goback);
  }, []);
  return (
    <View style={{flex: 1}}>
      {state === 0 && (
        <>
          <Image
            source={require('../../assets/icon-loading.gif')}
            style={styles.loadingGif}
          />
          <Text>{'正在加载中，请稍等...'}</Text>
          <Text>{`${id}`}</Text>
          <Button
            title="Go to Home"
            onPress={() => navigation.navigate('Home')}
          />
        </>
      )}
      {state === 1 && (
        <>
          <Image
            source={require('../../assets/icon-chat-waitting.gif')}
            style={styles.loadingGif}
          />
          <Text>{'出错了，请稍后尝试...'}</Text>
          <Text>{errorMsg}</Text>
          <Text>{`${id}`}</Text>
          <Button
            title="Go to Home"
            onPress={() => navigation.navigate('Home')}
          />
        </>
      )}
      {state === 2 && (
        <>
          <View style={{flex: 1}}>
            <View style={styles.header}>
              <Pressable
                style={styles.gobackbutton}
                onPress={() => {
                  navigation.navigate('Home');
                  dispatch(setPlayerStyle(0));
                }}>
                <Image
                  source={require('../../assets/goback/goback-pink.png')}
                  style={styles.goback}></Image>
              </Pressable>
              <Pressable onPress={selectIflike}>
                <Text>{likeList.indexOf(id) !== -1 ? 1 : 0}</Text>
              </Pressable>
              <Text style={styles.name}>{info.name}</Text>
              <Text style={styles.artists}>{info.artists}</Text>
              <Text style={styles.artists}>{info.alias}</Text>
            </View>
            <View style={styles.lyricPart}>
              <ScrollView ref={scrollWindow}>
                {lyric.map((item, index) => {
                  return currentPosition >= item.start &&
                    currentPosition <= item.end ? (
                    <Text
                      ref={myActive}
                      style={[styles.lyricText, {color: 'pink'}]}
                      key={index}>
                      {item.start}
                      {item.sentence}
                      {item.end}
                    </Text>
                  ) : (
                    <Text style={[styles.lyricText]} key={index}>
                      {item.start}
                      {item.sentence}
                      {item.end}
                    </Text>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  loadingGif: {
    width: 70,
    height: 70,
  },
  header: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    position: 'relative',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  artists: {
    fontSize: 12,
    fontWeight: '300',
  },
  goback: {
    width: 20,
    height: 20,
  },
  gobackbutton: {
    position: 'absolute',
    left: 10,
  },
  lyricPart: {
    flex: 1,
    paddingBottom: 100,
  },
  lyricText: {
    fontSize: 20,
    paddingLeft: 60,
    paddingRight: 60,
    lineHeight: 50,
  },
});
