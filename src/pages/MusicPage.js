import * as React from 'react';
import {
  Button,
  Text,
  View,
  TouchableHighlight,
  StyleSheet,
  Animated,
  Easing,
  TextInput,
  Image,
  TouchableWithoutFeedback,
  Alert,
  FlatList,
  style,
  ScrollView,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import MusicItem from '../components/Music/MusicItem';
import host from '../host';
import renderLoadMoreView from '../components/Common/more';
import {setUrlContext} from '../Context/context';
import {useDispatch, useSelector} from 'react-redux';
import {
  pushItem,
  nextPlay,
  lastPlay,
  onChangeDefaultVolume,
  setCurrentIndex,
} from '../store/playListSlice';

export default function MusicHeader() {
  const [keyWord, setKeyWord] = React.useState('');
  const [data, setData] = React.useState([]);
  const [isloading, setIsloading] = React.useState(false);
  const dispatch = useDispatch();
  const keyValue = useSelector(state => {
    return state.list.keyValue;
  });
  const list = useSelector(state => {
    return state.list.playList;
  });
  function transArrayToString(array = []) {
    let res = [];
    array.map((item, index) => {
      return res.push(item.name);
    });
    return res.join(',');
  }

  function loadData() {
    setIsloading(true);
    setTimeout(() => {
      //把数据反转
      let newArray = [];
      for (let i = data.length - 1; i >= 0; i--) {
        newArray.push(data[i]);
      }
      setData(newArray);
      setIsloading(false);
    }, 3000);
  }

  function loadMoreData() {
    //模拟网络请求
    setTimeout(() => {
      setData([...data, ...data]);
    }, 1000);
  }

  function textInputChange(value) {
    setKeyWord(value);
  }
  function searchPress() {
    fetch(`${host}/search?keywords=${keyWord}`)
      .then(res => {
        return res.json();
      })
      .then(res => {
        setData(res?.result?.songs || []);
        Alert.alert(JSON.stringify(res));
      });
    Keyboard.dismiss();
  }
  function onPressCard(data, setUrl) {
    const info = {
      name: data.name,
      artists: transArrayToString(data.artists || []),
      alias: data.alias,
      fee: data.fee,
    };
    console.log(info)
    const fetchUrl = () => {
      if (data.id in keyValue) {
        let currentIndex = list.findIndex((item, idx) => {
          return item.id === data.id;
        });
        setUrl(keyValue[data.id]);
        dispatch(setCurrentIndex(currentIndex === -1 ? 0 : currentIndex));
        return;
      }
      console.log(data.id)
      fetch(`${host}/song/url?id=${data.id}`)
        .then(res => {
          return res.json();
        })
        .then(res => {
          if (res.code === 200) {
            const url = res.data[0].url;
            setUrl(url);
            dispatch(pushItem({id: data.id, url: url, info: info}));
          } else {
          }
        });
    };
    fetchUrl();
  }
  return (
    <setUrlContext.Consumer>
      {setUrl => (
        <View style={{flex: 1}}>
          <View style={styles.headerContainer}>
            <Image
              source={require('../assets/icon-chat-waitting.gif')}
              style={styles.moreIcon}
            />
            <View
              style={styles.textInputContainer}
              keyboardShouldPersistTaps={'never'}>
              <TextInput
                placeholder="搜索你想要的歌曲"
                inlineImageLeft="search"
                inlineImagePadding={30}
                value={keyWord}
                onChangeText={textInputChange}
                style={styles.textInput}></TextInput>
            </View>
            <TouchableWithoutFeedback onPress={searchPress}>
              <View style={styles.serchButton}>
                <Text>搜索</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>

          <View style={styles.FlatList}>
            <FlatList
              ItemSeparatorComponent={
                Platform.OS !== 'android' &&
                (({highlighted}) => (
                  <View
                    style={[style.separator, highlighted && {marginLeft: 0}]}
                  />
                ))
              }
              data={data}
              renderItem={({item, index, separators}) => (
                <TouchableHighlight
                  onPress={() => {
                    onPressCard(item, setUrl);
                  }}
                  onShowUnderlay={separators.highlight}
                  onHideUnderlay={separators.unhighlight}>
                  <View style={{backgroundColor: 'white'}}>
                    <MusicItem name={item.name}></MusicItem>
                  </View>
                </TouchableHighlight>
              )}
              keyExtractor={(item, index) => index}
              refreshing={isloading}
              onRefresh={() => {
                loadData(); //下拉刷新加载数据
              }}
              // ListFooterComponent={() => renderLoadMoreView()}
              // onEndReached={() => loadMoreData()}
            />
          </View>
        </View>
      )}
    </setUrlContext.Consumer>
  );
}
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    height: 50,
  },
  textInputContainer: {
    height: 40,
    flex: 1,
    marginTop: 5,
  },
  textInput: {
    flex: 1,
    backgroundColor: 'white',
    paddingLeft: 10,
    borderRadius: 20,
  },
  moreIcon: {
    height: 50,
    width: 50,
    marginLeft: 10,
    marginRight: 10,
  },
  serchButton: {
    height: 50,
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  FlatList: {
    flex: 1,
  },
});
