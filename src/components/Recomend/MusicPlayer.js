import * as React from 'react';
import {
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableWithoutFeedback,
  ScrollView,
  Animated,
  Easing,
  Pressable,
} from 'react-native';
import host from '../../host';
import Slider from '@react-native-community/slider';
import Video from 'react-native-video';
import store from '../../store/store';
import {useDispatch, useSelector} from 'react-redux';
import {setUrlContext} from '../../Context/context';
import {
  setCurrentPositions,
  pushItem,
  nextPlay,
  lastPlay,
  indexPlay,
  onChangeDefaultVolume,
  setCurrentIndex,
} from '../../store/playListSlice';

export default function MusicPlayer({
  url,
  setUrl,
  playType,
  onChangeType,
  playerStyle,
  navigation,
}) {
  const TextPosition = React.useRef(new Animated.Value(0)).current;
  const textMove = () => {
    Animated.timing(TextPosition, {
      toValue: 100,
      duration: 8000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {
      TextPosition.setValue(0);
      textMove();
    });
  };

  // React.useEffect(() => {
  //   textMove();
  // }, []);
  let player = null;
  const defaultVolume = useSelector(state => {
    return state.list.defaultVolume;
  });
  const dispatch = useDispatch();
  const keyValue = useSelector(state => {
    return state.list.keyValue;
  });
  const list = useSelector(state => {
    return state.list.playList;
  });
  const currentIndex = useSelector(state => {
    return state.list.currentIndex;
  });
  const speedArray = [1.0, 1.5, 1.75, 2.0, 0.5, 0.75];
  const [volume, setVolume] = React.useState(defaultVolume);
  const [rate, setRate] = React.useState(1);
  const [pause, setPause] = React.useState(false);
  const [muted, setMuted] = React.useState(false);
  const [speedIndex, setSpeedIndex] = React.useState(0);
  const [isVolumeShow, setIsVolumeShow] = React.useState(false);
  const [duration, setDuration] = React.useState(0);
  const [currentPosition, setCurrentPosition] = React.useState(0);
  const [isListShow, setIsListShow] = React.useState(false);
  function onPlayClick() {
    setPause(!pause);
  }
  function onChangeVolume(value) {
    setVolume(value);
    dispatch(onChangeDefaultVolume(value));
  }
  function onVisibleClick() {
    setIsVolumeShow(!isVolumeShow);
  }
  function onVolumeClick() {
    setMuted(!muted);
  }
  function onChangeSpeed() {
    let idx = (speedIndex + 1) % speedArray.length;
    setSpeedIndex(idx);
    setRate(speedArray[idx]);
  }
  function onChangePosition(value) {
    setCurrentPosition(value);
    dispatch(setCurrentPositions(value))
    player.seek(value);
  }
  function setTime(data) {
    setCurrentPosition(data.currentTime);
    dispatch(setCurrentPositions(data.currentTime))
  }
  function transTime(duration) {
    let min = Math.floor(duration / 60);
    let second = parseInt(duration - min * 60);
    min = min >= 10 ? min : '0' + min;
    second = second >= 10 ? second : '0' + second;
    return min + ':' + second;
  }
  function clickNext(setUrl) {
    dispatch(nextPlay());
    const index = (currentIndex + 1) % list.length;
    if(playerStyle===1)
    navigation.navigate('MusicPlay', {
      id: list[index].id,
      info: list[index].info,
    });
    setUrl(list[index].url);
  }
  function clickLast(setUrl) {
    dispatch(lastPlay());
    const index = (currentIndex - 1 + list.length) % list.length;
    if(playerStyle===1)
    navigation.navigate('MusicPlay', {
      id: list[index].id,
      info: list[index].info,
    });
    setUrl(list[index].url);
  }
  function clickListItem(idx, setUrl) {
    dispatch(indexPlay(idx));
    if(playerStyle===1)
    navigation.navigate('MusicPlay', {
      id: list[idx].id,
      info: list[idx].info,
    });
    setUrl(list[idx].url);
  }
  function clickList() {
    setIsListShow(!isListShow);
  }
  function onLoadEvent(data) {
    setDuration(data.duration);
  }
  function onErrorEvent(e) {
    Alert.alert(JSON.stringify(e));
  }
  function onEndEvent() {
    if(playType.playTypeIndex===1) {
      return
    }
    if(playType.playTypeIndex===0) {
      clickNext(setUrl)
    }
  }
  function onChangePlayType() {
    playType.setPlayTypeIndex((playType.playTypeIndex + 1) % 3);
    onChangeType();
  }
  return (
    <Pressable
      style={[styles.musicPlayer, {bottom: playerStyle === 0 ? 50 : 0}]}
      onPress={() => {
        navigation.navigate('MusicPlay', {
          id: list[currentIndex].id,
          info: list[currentIndex].info,
        });
      }}>
      {isListShow && (
        <ScrollView style={styles.playList}>
          <View>
            {list.map((item, idx) => {
              return (
                <TouchableWithoutFeedback
                  onPress={() => {
                    clickListItem(idx, setUrl);
                  }}
                  key={idx}>
                  <View style={styles.songInfo} key={idx}>
                    <Animated.View
                      style={[
                        currentIndex === idx ? styles.songInfoText : '',
                        currentIndex === idx
                          ? {
                              left: TextPosition.interpolate({
                                inputRange: [0, 100],
                                outputRange: ['0%', '-150%'],
                              }),
                            }
                          : '',
                      ]}>
                      {currentIndex === idx ? (
                        <Text>{`${item.info.name} ${item.info.artists} ${item.info.alias}`}</Text>
                      ) : (
                        <Text
                          numberOfLines={
                            1
                          }>{`${item.info.name} ${item.info.artists} ${item.info.alias}`}</Text>
                      )}
                    </Animated.View>
                  </View>
                </TouchableWithoutFeedback>
              );
            })}
          </View>
        </ScrollView>
      )}

      <Video
        source={{uri: `${url}`}}
        ref={ref => {
          player = ref;
        }} // Store reference
        style={styles.backgroundVideo}
        repeat={playType.playTypeIndex===1}
        playInBackground={true}
        volume={volume}
        rate={rate}
        muted={muted}
        paused={pause}
        onLoad={data => {
          onLoadEvent(data);
        }}
        onError={e => {
          onErrorEvent(e);
        }}
        onProgress={e => setTime(e)}
        onEnd={()=>{onEndEvent()}}
      />
      <View style={styles.vedioplayer}>
        <Text>{playerStyle}</Text>
        <View style={{opacity: 1}}>
          <View style={styles.volumeControl}>
            <TouchableWithoutFeedback onPress={onVisibleClick}>
              {isVolumeShow ? (
                <Image
                  source={require('../../assets/visible/eyes.png')}
                  style={styles.visible}
                />
              ) : (
                <Image
                  source={require('../../assets/visible/Hide.png')}
                  style={styles.visible}
                />
              )}
            </TouchableWithoutFeedback>
            {isVolumeShow && (
              <Slider
                style={{width: 100, height: 10}}
                minimumValue={0}
                maximumValue={1}
                value={volume}
                minimumTrackTintColor="pink"
                maximumTrackTintColor="purple"
                onValueChange={onChangeVolume}
              />
            )}
            <TouchableWithoutFeedback onPress={onVolumeClick}>
              {!muted ? (
                <Image
                  source={require('../../assets/volume/volume-pink.png')}
                  style={styles.volume}
                />
              ) : (
                <Image
                  source={require('../../assets/volume/volume-close-pink.png')}
                  style={styles.volume}
                />
              )}
            </TouchableWithoutFeedback>
          </View>

          <TouchableWithoutFeedback onPress={onChangeSpeed}>
            <View>
              <Text>{`${speedArray[speedIndex]}x`}</Text>
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.playSlider}>
            <Text>{transTime(currentPosition)}</Text>
            <Slider
              style={{width: 200, height: 10}}
              minimumValue={0}
              maximumValue={duration}
              value={currentPosition}
              step={1}
              minimumTrackTintColor="pink"
              maximumTrackTintColor="purple"
              thumbTintColor="pink"
              onValueChange={onChangePosition}
            />
            <Text>{transTime(duration)}</Text>
          </View>
          <View style={styles.playControl}>
            <TouchableWithoutFeedback
              onPress={() => {
                clickLast(setUrl);
              }}>
              <Image
                source={require('../../assets/direction/icon-last.png')}
                style={styles.last}
              />
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={onPlayClick}>
              <Image
                source={require('../../assets/stop/stop-pink.png')}
                style={styles.pause}
              />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => {
                clickNext(setUrl);
              }}>
              <Image
                source={require('../../assets/direction/icon-next.png')}
                style={styles.next}
              />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={clickList}>
              <Image
                source={require('../../assets/list/list-view-pink.png')}
                style={styles.viewMore}
              />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={onChangePlayType}>
              {playType.playTypeIndex === 0 ? (
                <Image
                  source={require('../../assets/playType/listPlay-pink.png')}
                  style={styles.viewMore}
                />
              ) : playType.playTypeIndex === 1 ? (
                <Image
                  source={require('../../assets/playType/singlePlay-pink.png')}
                  style={styles.viewMore}
                />
              ) : (
                <Image
                  source={require('../../assets/playType/randomPlay-pink.png')}
                  style={styles.viewMore}
                />
              )}
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  musicPlayer: {
    width: '100%',
    position: 'absolute',
  },
  playList: {
    alignSelf: 'center',
    width: '90%',
    height: 300,
    position: 'absolute',
    top: -320,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    elevation: 4,
    shadowColor: 'black',
  },
  loadingGif: {
    width: 70,
    height: 70,
  },
  songInfo: {
    width: 250,
    height: 20,
    flexDirection: 'row',
    overflow: 'hidden',
    flexWrap: 'nowrap',
    marginBottom: 12,
    position: 'relative',
  },
  songInfoText: {
    position: 'absolute',
  },
  text: {
    backgroundColor: 'red',
    width: 100,
    height: 100,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  vedioplayer: {
    width: '100%',
    height: 100,
    backgroundColor: 'white',
    borderRadius: 8,
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: 'black',
    opacity: 0.9,
  },
  pause: {
    width: 20,
    height: 20,
  },
  volume: {
    width: 20,
    height: 20,
  },
  visible: {
    width: 20,
    height: 20,
  },
  volumeControl: {
    flexDirection: 'row',
  },
  playSlider: {
    flexDirection: 'row',
  },
  playControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  last: {
    width: 16,
    height: 16,
  },
  next: {
    width: 16,
    height: 16,
  },
  viewMore: {
    width: 20,
    height: 20,
  },
});
