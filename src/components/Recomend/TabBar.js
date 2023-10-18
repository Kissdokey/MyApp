import * as React from 'react';
import {
  Button,
  Text,
  View,
  TouchableHighlight,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
let headerUnderlineLeft = new Animated.Value(3);
const headerUnderlineMove = number => {
  Animated.timing(headerUnderlineLeft, {
    toValue: number === 0 ? 3 : 53,
    duration: 200,
    easing: Easing.linear,
    useNativeDriver: false,
  }).start(() => {});
};
export default function TabBar({ state, descriptors, navigation, position }) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  let isRecommend = state.index === 0
  const isFocus = state.index === 1;
  React.useEffect(()=>{
    headerUnderlineMove(state.index)
  },[state.index])
  function onPressRec() {
    if (isRecommend) {
      return;
    }
    setActiveIndex(0);
    headerUnderlineMove(0);
    navigation.navigate('Recommend');
  }
  function onPressFoc() {
    if (isFocus) {
      return;
    }
    setActiveIndex(1);
    headerUnderlineMove(1);
    navigation.navigate('Focus');
  }
  return (
    <View style={{height: 50, backgroundColor: 'white', flexDirection: 'row'}}>
      <TouchableHighlight style={styles.headerHighlight}>
        <View>
          <Text
            style={isRecommend ? styles.headerTextActive : ''}
            onPress={onPressRec}>
            推荐
          </Text>
        </View>
      </TouchableHighlight>
      <TouchableHighlight style={styles.headerHighlight}>
        <View>
          <Text
            style={isFocus ? styles.headerTextActive : ''}
            onPress={onPressFoc}>
            关注
          </Text>
        </View>
      </TouchableHighlight>
      <Animated.View style={styles.headerUnderline}></Animated.View>
    </View>
  );
}
const styles = StyleSheet.create({
    headerHighlight: {
      width: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTextNormal: {
  
    }
    ,
    headerTextActive: {
      fontSize:15,
      fontWeight:'bold'
    },
    headerUnderline:{
      width:44,
      height:3,
      backgroundColor:'yellow',
      position:'absolute',
      bottom:10,
      left:headerUnderlineLeft
    }
  });
  