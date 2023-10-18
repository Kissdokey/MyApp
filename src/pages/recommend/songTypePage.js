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
import {setUrlContext} from '../../Context/context';
import {
  ifLike,
  pushItem,
  nextPlay,
  lastPlay,
  onChangeDefaultVolume,
  setCurrentIndex,
} from '../../store/playListSlice';
export default function Erciyuan({navigation,type}) {
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

  function onPressCard(data,setUrl) {
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
  return (
    <setUrlContext.Consumer>
      {setUrl => (
        <FlatList
          numColumns={2}
          data={songs}
          renderItem={({item, index}) => (
            <View style={{backgroundColor: 'white', width: '50%'}}>
              <MusicCard
                data={item}
                index={index}
                onPressCard={() => {
                  onPressCard(item,setUrl);
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
      )}
    </setUrlContext.Consumer>
  );
}
const styles = StyleSheet.create({});
