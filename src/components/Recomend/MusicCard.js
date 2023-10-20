import * as React from 'react';
import {
  Button,
  Text,
  View,
  TouchableHighlight,
  StyleSheet,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
function transArrayToString(array = []) {
  let res = [];
  array.map((item, index) => {
    return res.push(item.name);
  });
  return res.join(',');
}

export default function MusicCard({
  data,
  index,
  navigation,
  onPressCard,
  imgSrc,
}) {
  function clickSong(data) {
    const info = {
      name: data.name,
      artists: transArrayToString(data.artists || []),
      alias: data.alias,
      fee: data.fee,
    };
    onPressCard();
    navigation.navigate('MusicPlay', {id: data.id, info: info});
  }
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        clickSong(data);
      }}>
      <View style={[styles.cardBox]}>
        {imgSrc && (
          <Image
            borderTopLeftRadius={12}
            width={118}
            height={'100%'}
            source={{uri: imgSrc['list@2x']}}
          />
        )}
        <View style={styles.bgImg}>
          {imgSrc && (
            <Image
              borderRadius={12}
              width={'100%'}
              height={'100%'}
              source={{uri: imgSrc['card@2x']}}
            />
          )}
        </View>
        {/* <Text>{data?.name || ""}</Text> */}
        {/* <Text>{transArrayToString(data.artists || []) }</Text>
            <Text>{data.album.name}</Text>
            <Text>{data.alias}</Text>
            <Text>{(data.transNames||[]) [0]}</Text>
            <Text>{data.fee}</Text> */}
        <View style={styles.songInfo}>
          <Text numberOfLines={1} style={styles.name}>
            {data?.name || ''}
          </Text>
          {data?.artists && <Text numberOfLines={1} style={styles.artists}>{"by "}{transArrayToString(data.artists || [])}</Text>}
          {data?.album?.name && <Text numberOfLines={1} style={styles.album}>{"from "}{data.album.name}</Text>}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  cardBox: {
    flex: 1,
    position: 'relative',
    flexDirection: 'row',
    height: 118,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: 'white',
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15,
    overflow: 'hidden',
  },
  carBoxRight: {
    marginRight: 10,
    marginLeft: 5,
  },
  cardBoxLeft: {
    marginLeft: 10,
    marginRight: 5,
  },
  songInfo: {
    position: 'absolute',
    height: 118,
    width: '100%',
    left: 105,
    right: 20,
    opacity: 0.8,
    backgroundColor: 'rgb(57,66,70)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  bgImg: {
    position: 'absolute',
    left: 105,
    height: 118,
    width: '100%',
  },
  name: {
    color: 'white',
    width:'50%',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 10,
  },
  album: {
    color: 'white',
    width:'60%',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 10,
  },
  artists: {
    color: 'white',
    width:'60%',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 10,
  }
});
