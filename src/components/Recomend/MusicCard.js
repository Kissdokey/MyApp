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
  Alert
} from 'react-native';
function transArrayToString(array=[]) {
    let res = []
    array.map((item,index)=>{
           return res.push(item.name)
    })
    return res.join(',')
}

export default function MusicCard({data,index,navigation,onPressCard}) {
    function clickSong(data) {
        const info = {
            name:data.name,
            artists:transArrayToString(data.artists || []),
            alias:data.alias,
            fee:data.fee
        }
        onPressCard()
        navigation.navigate('MusicPlay',{id:data.id,info:info})
    }
    return (
        <TouchableWithoutFeedback onPress={()=>{
            clickSong(data)
        }}>
        <View style={[index%2===0?styles.cardBoxLeft:styles.carBoxRight,styles.cardBox]}>
            <Text>{data?.name || ""}</Text>
            {/* <Text>{transArrayToString(data.artists || []) }</Text>
            <Text>{data.album.name}</Text>
            <Text>{data.alias}</Text>
            <Text>{(data.transNames||[]) [0]}</Text>
            <Text>{data.fee}</Text> */}
        </View>
        </TouchableWithoutFeedback>

    )
}
const styles = StyleSheet.create({
    cardBox: {
        height:150,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:2,
        backgroundColor:'white',
        marginTop:10,
        borderWidth: 0.1,
        borderColor: '#000000',
        shadowColor: 'black',
    },
    carBoxRight:{
        marginRight:10,
        marginLeft:5
    },
    cardBoxLeft:{
        marginLeft:10,
        marginRight:5
    }
})