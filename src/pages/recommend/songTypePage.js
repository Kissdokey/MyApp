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
} from 'react-native';
import host from '../../host';
import MusicCard from '../../components/Recomend/MusicCard';
import renderLoadMoreView from '../../components/Common/more';
import mockData from '../../MockData/keywords';
import {useDispatch, useSelector} from 'react-redux';
import {setUrlContext, Covers} from '../../Context/context';
import {
  ifLike,
  pushItem,
  nextPlay,
  lastPlay,
  onChangeDefaultVolume,
  setCurrentIndex,
} from '../../store/playListSlice';
export default function Erciyuan({navigation, type}) {
  React.useEffect(() => {
    const color =
      type === '二次元'
        ? 'rgb(50,43,107)'
        : type === '古风'
        ? 'rgb(26,59,79)'
        : 'rgb(25,66,24)';
    const color2 =
      type === '二次元'
        ? 'rgb(140,102,255)'
        : type === '古风'
        ? 'rgb(102,204,255)'
        : 'rgb(115,255,102)';
    navigation.setOptions({
      tabBarStyle: {backgroundColor: color, height: 60, paddingTop: 15},
      tabBarIndicatorStyle: {
        backgroundColor: color2,
        height: 34,
        width: 80,
        borderRadius: 8,
        margin: 8,
        marginBottom: 3,
      },
    });
  }, []);
  const dispatch = useDispatch();
  const keyValue = useSelector(state => {
    return state.list.keyValue;
  });
  const list = useSelector(state => {
    return state.list.playList;
  });
  const [isloading, setIsloading] = React.useState(false);
  const [songs, setSongs] = React.useState([]);
  const [offset, setOffset] = React.useState(0);
  const [covers, setCovers] = React.useState([]);
  // React.useEffect(() => {
  //   const fetchSongs = () => {
  //     fetch(`${host}/search?keywords=二次元`)
  //       .then(res => {
  //         return res.json();
  //       })
  //       .then(res => {
  //         setSongs(res?.result?.songs || []);
  //         Alert.alert(JSON.stringify(res));
  //       });
  //   };
  //   fetchSongs();
  // }, []);
  function loadMoreData() {
    // const fetchSongs = () => {
    //   fetch(`${host}/search?keywords=${type}&offset=${offset}`)
    //     .then(res => {
    //       return res.json();
    //     })
    //     .then(res => {
    //       setSongs([...songs, ...(res?.result?.songs || [])]);
    //       setOffset(offset + 30);
    //       Alert.alert(JSON.stringify(res));
    //     });
    // };
    const fetchSongs = () => {
      setSongs(mockData.result.songs);
    };
    fetchSongs();
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
      artists: transArrayToString(data.artists || []),
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
    fetch(
      `https://osu.ppy.sh/beatmapsets/search?cursor_string=${
        type === '二次元'
          ? '1'
          : type === '古风'
          ? 'eyJhcHByb3ZlZF9kYXRlIjoxNjk2NzI5NDEzMDAwLCJpZCI6MjAxOTczMH0'
          : 'eyJhcHByb3ZlZF9kYXRlIjoxNjk3MzM3Nzc1MDAwLCJpZCI6MjAwNDIxM30'
      }`,
    )
      .then(res => {
        return res.json();
      })
      .then(res => {
        let beatsArray = res.beatmapsets;
        let covers = beatsArray.map(item => {
          return item.covers;
        });
        setCovers(covers);
      });
  }, []);
  return (
    <setUrlContext.Consumer>
      {setUrl => (
        <View>
          <FlatList
            data={songs}
            renderItem={({item, index}) => (
              <View style={{backgroundColor: 'rgb(34,40,42)', width: '100%'}}>
                <MusicCard
                  data={item}
                  index={index}
                  imgSrc={covers[index % 50]}
                  onPressCard={() => {
                    onPressCard(item, setUrl);
                  }}
                  navigation={navigation}></MusicCard>
              </View>
            )}
            keyExtractor={(item, index) => index}
            refreshing={isloading}
            // onRefresh={() => {
            //   loadData(); //下拉刷新加载数据
            // }}
            ListFooterComponent={() => renderLoadMoreView()}
            onEndReached={() => loadMoreData()}
          />
        </View>
      )}
    </setUrlContext.Consumer>
  );
}
const styles = StyleSheet.create({});
