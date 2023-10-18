import * as React from 'react';
import {Button, Text, View, ScrollView, Alert,FlatList,TouchableHighlight, StyleSheet,ActivityIndicator} from 'react-native';
export default function renderLoadMoreView() {
    return (
      <View style={styles.loadMore}>
        <ActivityIndicator
          style={styles.indicator}
          size={'large'}
          color={'red'}
          animating={true}
        />
        <Text>正在加载更多</Text>
      </View>
    );
  }
const styles = StyleSheet.create({})