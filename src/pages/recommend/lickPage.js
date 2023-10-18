import * as React from 'react';
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
  TextInput,
  Pressable,
  Image,
} from 'react-native';
import host from '../../host';
import MusicCard from '../../components/Recomend/MusicCard';
import renderLoadMoreView from '../../components/Common/more';
import mockData from '../../MockData/keywords';
import {useDispatch, useSelector} from 'react-redux';
import {setUrlContext} from '../../Context/context';
import {
  setLikeInfoList,addLikeInfo,deleteLikeInfo,
  deleteLikeSong,
  addLikeSong,
  setLikeList,
  pushItem,
  nextPlay,
  lastPlay,
  onChangeDefaultVolume,
  setCurrentIndex,
} from '../../store/playListSlice';
import {get} from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
export default function LickPage({navigation}) {
  const dispatch = useDispatch();
  const keyValue = useSelector(state => {
    return state.list.keyValue;
  });
  const list = useSelector(state => {
    return state.list.playList;
  });
  const likeList = useSelector(state => {
    return state.list.likeList
  })
  const [ids, setIds] = React.useState([]);
  const [phone, setPhone] = React.useState('');
  const [captcha, setCaptcha] = React.useState('');
  const [unikey, setUnikey] = React.useState('');
  const [codeUrl, setCodeUrl] = React.useState('');
  const [isLogin, setIsLogin] = React.useState(false);
  const songs = useSelector((state)=> {
    return state.list.likeInfoList
  })
  function checkStatus(key, timer) {
    console.log('checkKey', key);
    fetch(`${host}/login/qr/check?key=${key}&timestamp=${Date.now()}`, {
      method: 'post',
      credentials: 'include',
    })
      .then(res => {
        return res.json();
      })
      .then(res => {
        console.log('res', res);
        if (res.code === 800) {
          Alert.alert('二维码已过期,请重新获取');
          clearInterval(timer);
        }
        if (res.code === 803) {
          // 这一步会返回cookie
          clearInterval(timer);
          Alert.alert('授权登录成功');
          fetchSongs();
        }
        return res;
      });
  }
  function getUniKey() {
    console.log('key');
    fetch(`${host}/login/qr/key?timestamp=${Date.now()}`, {
      credentials: 'include',
    })
      .then(res => {
        return res.json();
      })
      .then(res => {
        console.log(res);
        setUnikey(res.data.unikey);
        getCodeUrl(res.data.unikey);
        timer = setInterval(() => {
          checkStatus(res.data.unikey, timer);
        }, 5000);
        return res;
      });
  }
  function getCodeUrl(key) {
    console.log(key, 1111);
    fetch(
      `${host}/login/qr/create?key=${key}&qrimg=true&timestamp=${Date.now()}`,
      {
        credentials: 'include',
      },
    )
      .then(res => {
        return res.json();
      })
      .then(res => {
        console.log(res, 'urlll');
        setCodeUrl(res.data.qrimg);
        return res;
      });
  }

  // React.useEffect(()=> {
  //  const init = ()=>{
  //   const key =  getUniKey()

  //  }
  //  init()
  // },[])
  const fetchSongs = () => {
    fetch(`${host}/login/status`, {
      method: 'POST',
      credentials: 'include',
    })
      .then(res => {
        return res.json();
      })
      .then(res => {
        if (res.data.code === 200) {
          setIsLogin(true);
          if (res.data.account.id) {
            fetch(`${host}/likelist`, {
              method: 'POST',
              credentials: 'include',
              body: {uid: res.data.account.id},
            })
              .then(res => {
                console.log(res);
                return res.json();
              })
              .then(res => {
                console.log(res.ids);
                setIds(res.ids);
                dispatch(setLikeList(res.ids))
                fetch(`${host}/song/detail?ids=${res.ids.join(',')}`)
                  .then(res => {
                    return res.json();
                  })
                  .then(res => {
                    dispatch(setLikeInfoList(res.songs))
                  });
              });
          } else {
            Alert.alert('登陆出错');
          }
        }
      });
  };
  function onChangePhone(value) {
    setPhone(value);
  }
  function onChangeCaptcha(value) {
    setCaptcha(value);
  }
  function fetchCaptcha() {
    let timestamp = Date.now();
    fetch(`${host}/captcha/sent?phone=${phone}&timestamp=${timestamp}`, {
      method: 'POST',
      credentials: 'include',
    });
  }
  function login() {
    let timestamp = Date.now();
    fetch(
      `${host}/captcha/verify?phone=${phone}&captcha=${captcha}&timestamp=${timestamp}`,
      {
        method: 'POST',
        credentials: 'include',
      },
    )
      .then(res => {
        return res.json();
      })
      .then(res => {
        if (res.code === 200) {
          fetchSongs();
        }
      });
  }
  function transArrayToString(array = []) {
    let res = [];
    array.map((item, index) => {
      return res.push(item.name);
    });
    return res.join(',');
  }
  function onPressCard(data, setUrl) {
    const info = {
      name: data.name,
      artists: transArrayToString(data.ar || []),
      alias: data.alias,
      fee: data.fee,
    };

    const fetchUrl = () => {
      if (data.id in keyValue) {
        let currentIndex = list.findIndex((item, idx) => {
          return item.id === data.id;
        });
        setUrl(keyValue[data.id]);
        dispatch(setCurrentIndex(currentIndex === -1 ? 0 : currentIndex));
        return;
      }
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
  React.useEffect(() => {
    fetchSongs();
  }, []);
  return (
    <>
      {!isLogin ? (
        <>
          <View style={styles.login}>
            <TextInput
              placeholder="输入手机号"
              value={phone}
              onChangeText={onChangePhone}
              style={styles.loginInput}></TextInput>
            <Pressable onPress={fetchCaptcha} style={styles.inputButton}>
              <Text>获取验证码</Text>
            </Pressable>
          </View>
          <View style={styles.login}>
            <TextInput
              placeholder="输入验证码"
              value={captcha}
              onChangeText={onChangeCaptcha}
              style={styles.loginInput}></TextInput>
            <Pressable onPress={login} style={styles.inputButton}>
              <Text>验证</Text>
            </Pressable>
          </View>
        </>
      ) : (
        <View>
        <setUrlContext.Consumer>
          {setUrl => (
            <View>
              <FlatList
                numColumns={2}
                data={songs}
                renderItem={({item, index}) => (
                  <View style={{backgroundColor: 'white', width: '50%'}}>
                    <MusicCard
                      data={item}
                      index={index}
                      onPressCard={() => {
                        onPressCard(item, setUrl);
                      }}
                      navigation={navigation}></MusicCard>
                  </View>
                )}
                keyExtractor={(item, index) => index}
                // refreshing={isloading}
                // onRefresh={() => {
                //   loadData(); //下拉刷新加载数据
                // }}
                // ListFooterComponent={() => renderLoadMoreView()}
                // onEndReached={() => loadMoreData()}
              />
            </View>
          )}
        </setUrlContext.Consumer>
        </View>
      )}
      {/* <ScrollView>
      <Text>{unikey}</Text>
      <Text>{codeUrl}</Text>
      <Image width={104} height={104} source={{uri:codeUrl}}></Image>
      </ScrollView> */}
    </>
  );
}
const styles = StyleSheet.create({
  login: {
    flexDirection: 'row',
  },
  loginInput: {
    width: '70%',
    height: 40,
    backgroundColor: 'white',
    marginLeft: 10,
    marginTop: 10,
    borderRadius: 20,
  },
  inputButton: {
    marginTop: 10,
    marginRight: 10,
    height: 40,
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
  },
});
