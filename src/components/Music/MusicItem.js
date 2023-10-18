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
} from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import store from '../../store/store'
import {turnDark,turnBlue,turnGreen,turnPink} from '../../store/bgColorSlice'

export default function MusicItem({name}) {
  const sceneType = useSelector((state) => {
    return state.scene.sceneColor;
});
const dispatch = useDispatch();
function changeType() {
  dispatch(turnPink())
}
  return (
    <View style={styles.listItem}>
      <View style={styles.img}></View>
      <View style={styles.info}>
        <Text>{name}</Text>
        <Text>{sceneType}</Text>
        <Button title='Change' onPress={changeType}></Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listItem: {
    flex: 1,
    height: 150,
    backgroundColor: 'white',
    marginBottom: 8,
    marginTop: 8,
    marginLeft: 8,
    marginRight: 8,
    borderRadius: 8,
    borderCurve: 'circular',
    borderBlockColor: 'black',
    elevation: 4,
    shadowColor: 'black',
  },
  img: {
    flex: 1,
    backgroundColor:'pink',
    borderTopRightRadius:8,
    borderTopLeftRadius:8
  },
  info: {
    flex: 1,
  },
});
